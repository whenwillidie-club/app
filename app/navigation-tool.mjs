export function registerNavigation(context,navigate){
 if(!context?.registerTool)return ()=>{};
 const lifecycle=new AbortController();
 const tool={name:'start_health_import',title:'Open import choices',description:'Navigate to the visible import setup. Does not connect an EHR, grant consent, retrieve health data, or reveal an estimate.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},execute:async input=>{if(!input||typeof input!=='object'||Array.isArray(input)||Object.keys(input).length)throw new Error('Expected an empty object.');await navigate();return {view:'import_setup',connectionStarted:false};}};
 try{Promise.resolve(context.registerTool(tool,{signal:lifecycle.signal})).catch(()=>{});}catch{}
 return ()=>lifecycle.abort();
}
