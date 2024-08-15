import { fileURLToPath } from 'url';
import path from 'path';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputSuccess = path.join(__dirname, '..', '..','public', 'index.html')


function success(req, res) {
  res.sendFile(outputSuccess);
}

/*router.get('/signin', isNotLoggedIn, (req,res) => {
  res.render('auth/signin')
})*/

export default success