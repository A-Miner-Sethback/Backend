const hash = require('hash.js')
const utf8 = require('utf8')

async function mineFunc(last_proof, difficulty)
{
    let proof = Math.random()
    while(!validProof(last_proof, proof, difficulty))
    {
        // console.log('proof val', proof)
        proof += 1
    }
    return proof
}

function validProof(last_proof, proof, difficulty)
{
    let guess = JSON.parse(JSON.stringify(`${last_proof}${proof}`))
    let guessHash = hash.sha256().update(guess).digest('hex')
    // console.log(guess)
    // console.log(guessHash)
    let j = 0
    for(let i=0; i<difficulty; i++)
    {
        if(guessHash[i] !== 0) 
        {
            if(j > 2)
            {
                console.log(j)
            }
            j = 0
            return false
        }
        j++
    }
    return true
}

module.exports = mineFunc