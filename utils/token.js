// import jwt from "jsonwebtoken";

// export const createJwtToken = (payload) => {
//     const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "20d" });
//     return token;
//   };
  

// export const verifyToken = (token) => {
//     try {
//         const { user } = jwt.verify(token, process.env.JWT_SECRET);
//         return user;
//     } catch (error) {
//         console.log(error)
//     }
// }


import jwt from "jsonwebtoken";

export const createJwtToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "20d" });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET); 
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    return null;
  }
};
