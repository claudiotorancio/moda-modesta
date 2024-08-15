import { genSalt, hash as _hash, compare } from 'bcrypt';

const helpers = {};

helpers.encryptPassword =  async (password) => {
    const salt = await genSalt(10)
    const hash = await _hash(password, salt)
    return hash;
}

helpers.matchPassword = async (password, savedPassword) => {

    try {
        return await compare(password, savedPassword)
        
    }catch(e) {
        console.log(e)
    }
    
}

/*helpers.encryptPassword('12345')
    .then((data) => {
        console.log(data);
    })
    .catch((error) => {
        console.error(error);
    });*/

export default helpers
