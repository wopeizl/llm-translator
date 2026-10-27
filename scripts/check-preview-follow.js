const assert = require('node:assert/strict');
const Module = require('node:module');
const commands = new Map();
let listener, disposed, panel, requests = [], configValues = {};
const doc = (name, languageId = 'markdown') => ({languageId, uri: {path: '/' + name, toString: () => name}, getText: () => name});
const a = doc('a.md'), b = doc('b.md', 'skill');
let current = a;
const vscode = {
 commands: {registerCommand: (name, fn) => {commands.set(name, fn); return {dispose(){}};}},
 workspace: {openTextDocument: async uri => uri.toString() === 'a.md' ? a : b,
 getConfiguration: () => ({get: (key, fallback) => configValues[key] ?? ({provider:'glm', 'glm.model':'test',targetLanguage:'中文'}[key] ?? fallback)})},
 ViewColumn: {Beside:2}, ProgressLocation: {Notification:1},
 window: {get activeTextEditor(){return {document:current};},
 onDidChangeActiveTextEditor: fn => {listener=fn;return {dispose(){}};},
 showWarningMessage: async () => {},showErrorMessage: message => {throw Error(message);},
 withProgress: (_,fn) => fn({report(){}},{onCancellationRequested: () => ({dispose(){}})}),
 createWebviewPanel: () => panel = {title:'',webview:{html:'',onDidReceiveMessage(){}},reveal(){},onDidDispose(fn){disposed=fn;},dispose(){disposed();}}
 }
};
const original = Module._load;
Module._load = function(name, parent, ...rest) {
 if(name === 'vscode') return vscode;
 if(name === './translator' && parent.filename.endsWith('/out/extension.js')) return {translateMarkdown(source,config,key,opts){return new Promise((resolve,reject)=>requests.push({source,resolve,reject,signal:opts.signal}));}};
 if(name === './webview' && parent.filename.endsWith('/out/extension.js')) return {renderResultHtml: x=>x,renderLoadingHtml:()=> 'loading',renderErrorHtml:x=>'error:'+x};
 return original.call(this,name,parent,...rest);
};
const extension = require('../out/extension');
Module._load = original;
const subscriptions=[];
extension.activate({subscriptions,secrets:{get:async()=> 'test-key'}});
const tick = () => new Promise(resolve=>setImmediate(resolve));
const switchTo = async document => {current=document;listener({document});await new Promise(resolve=>setTimeout(resolve,250));await tick();};
(async()=>{
 await switchTo(a);assert.equal(requests.length,0,'switch alone must not open preview');
 const first=commands.get('llmTranslator.openPreview')();await tick();
 assert.equal(requests.length,1);
 await switchTo(b);assert.equal(requests.length,2);assert.equal(requests[0].signal.aborted,false,'A continues in background');
 await switchTo(a);assert.equal(requests.length,2,'A→B→A reuses in-flight A');
 requests[1].resolve('译文B');await tick();assert.equal(panel.webview.html,'loading','background B cannot overwrite A');
 requests[0].resolve('译文A');await first;await tick();assert.equal(panel.webview.html,'译文A');
 await switchTo(b);assert.equal(requests.length,2);assert.equal(panel.webview.html,'译文B','background completion is cached');
 configValues['glm.model']='other';await switchTo(b);assert.equal(requests.length,3,'model change invalidates cache');
 const oldRequest=requests[2];commands.get('llmTranslator.refresh')();await tick();assert.equal(requests.length,4);assert.equal(oldRequest.signal.aborted,true,'refresh cancels only matching task');
 oldRequest.resolve('obsolete');await tick();assert.equal(panel.webview.html,'loading');
 requests[3].resolve('新B');await tick();assert.equal(panel.webview.html,'新B');
 await switchTo(a);assert.equal(requests.length,5);
 configValues['glm.model']='third';await switchTo(b);assert.equal(requests.length,6);
 panel.dispose();assert.equal(requests[4].signal.aborted,true);assert.equal(requests[5].signal.aborted,true);
 requests[4].resolve('closed A');requests[5].resolve('closed B');await tick();
 for(const subscription of subscriptions)subscription.dispose();
 console.log('Preview follow/cache/race/cancellation checks passed.');
})().catch(error=>{console.error(error);process.exitCode=1;});
