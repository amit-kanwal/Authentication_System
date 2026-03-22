import dotenv from 'dotenv'

dotenv.config()
// if the .env file donot have the required environment variable
if(!process.env.DATABASE_URL){
    throw new Error("DATABASE_URL is not avaiable in the .env file")
}

if(!process.env.SECRET_KEY){
    throw new Error("SECRET_KEY is not avaiable in the .env file")
}
const config = {
    DATABASE_URL : process.env.DATABASE_URL,
    SECRET_KEY: process.env.SECRET_KEY
};

export default config