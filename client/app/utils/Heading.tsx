import React,{FC} from "react";
interface HeadProps{
    title:string,
    description:string,
    keywords:string,
}


const Heading :FC<HeadProps>=({title,description,keywords})=>{
return(
    <>
    <title>{title}</title>
    <meta name="description" content={description}></meta>
    <meta name="keywords" content={keywords}></meta>
    </>
)
}

export default Heading