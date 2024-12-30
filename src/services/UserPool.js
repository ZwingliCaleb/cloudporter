import { CognitoUserPool } from 'amazon-cognito-identity-js';

const poolData = {
    UserPoolId: 'us-east-1_k2DZEFxF4',
    ClientId: '75jc6l929g8l6r9ejru2bifaop'
};

const userPool = new CognitoUserPool(poolData);
export default userPool;