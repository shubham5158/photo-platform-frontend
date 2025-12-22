import{d as a}from"./index-C2RzipVP.js";const i=async e=>(await a.get(`/gallery/${e}`)).data,c=async(e,r)=>(await a.post(`/gallery/${e}/price-preview`,{photoIds:r})).data;export{c as a,i as g};
