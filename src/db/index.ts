import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

(async()=>{
 await mongoose
  .connect(process.env.DB as string)
  .then(() => {
    console.log('Mongoose server connected successfully');
  })
  .catch((error) => {
    console.log('-----error------', error);
  });
})()


export default mongoose;
