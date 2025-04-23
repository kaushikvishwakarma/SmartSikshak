import DataUriParser from "datauri/parser.js";
import path from "path";

const parser = new DataUriParser();

const getDataUri = (file) => {
  if (!file || !file.originalname || !file.buffer) {
    console.error("⚠️ Invalid file input to getDataUri", file);
    return null;
  }

  const extName = path.extname(file.originalname).toString();
  return parser.format(extName, file.buffer); // return full object, not just .content
};

export default getDataUri;

// import DataUriParser from "datauri/parser.js";
// import path from "path";

// const parser = new DataUriParser();

// const getDataUri = (file) => {
//   if (!file || !file.originalname || !file.buffer) {
//     console.error("⚠️ Invalid file input to getDataUri", file);
//     return null;
//   }

//   const extName = path.extname(file.originalname).toString();
//   const dataUri = parser.format(extName, file.buffer);
//   return dataUri?.content || null;
// };

// export default getDataUri;

// import DataUriParser from  "datauri/parser.js";
// import path from "path";
// const parser=new DataUriParser();
// const getDataUri=(file)=>{
//     const extName=path.extname(file.originalname).toString();
//     return parser.format(extName,file.buffer).content;
// }
// export default getDataUri;