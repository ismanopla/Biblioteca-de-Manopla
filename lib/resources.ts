import {listRecords} from './storage';
import {getChatGPTUser} from '@/app/chatgpt-auth';
export type Resource={id:string;project_id:string;title:string;author:string;description:string;url:string;file_key:string;filename:string;size:number;hidden:number};
const raw=[
['Diccionario del español dominicano','Academia Dominicana de la Lengua · Igalex','https://ded.igalex.org/Consultas/About','Obra de consulta del vocabulario dominicano.'],
['Los diccionarios de la Academia Dominicana de la Lengua','Academia Dominicana de la Lengua · 2021','https://academia.org.do/2021/12/17/los-diccionarios-de-la-academia-dominicana-de-la-lengua/',''],
['Aporte de la ADL al estudio del español dominicano','Academia Dominicana de la Lengua · 2022','https://academia.org.do/2022/03/11/aporte-de-la-adl-al-estudio-del-espanol-dominicano/',''],
['El Diccionario fraseológico y la cultura idiomática dominicana','Academia Dominicana de la Lengua · 2016','https://academia.org.do/2016/07/16/el-diccionario-fraseologico-y-la-cultura-idiomatica-dominicana/',''],
['Se publica el Diccionario del español dominicano','Asociación de Academias de la Lengua Española · 2013','https://www.asale.org/noticia/se-publica-el-diccionario-del-espanol-dominicano',''],
['El Diccionario del español dominicano se actualiza: DED.2.5','Fundéu Guzmán Ariza · 2026','https://fundeu.do/el-diccionario-del-espanol-dominicano-se-actualiza-actualizacion-ded-2-5-enero-marzo-2026/','']];
export const initial:Resource[]=raw.map(([title,author,url,description],i)=>({id:'ref-'+i,project_id:'dominicano',title,author,url,description,file_key:'',filename:'',size:0,hidden:0}));
export async function isAdmin(){const u=await getChatGPTUser();return !!u&&!!process.env.ADMIN_EMAIL&&u.email.toLowerCase()===process.env.ADMIN_EMAIL.toLowerCase();}
export async function listResources(){const rows=await listRecords<Resource>('resources/');const map=new Map(initial.map(r=>[r.id,r]));for(const r of rows)map.set(r.id,r);return [...map.values()];}
export async function guard(req:Request){if(!await isAdmin())return Response.json({error:'Acceso reservado al administrador.'},{status:403});if(req.headers.get('origin')!==new URL(req.url).origin)return Response.json({error:'Solicitud no permitida.'},{status:403});return null;}
