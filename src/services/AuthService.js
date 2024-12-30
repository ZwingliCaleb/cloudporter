import Userpool from '../services/UserPool';
import { CognitoUser, AuthenticationDetails, CognitoUserAttribute } from 'amazon-cognito-identity-js';

export const signUp = (email, password, fullname) => {
    const attributeList = [
        new CognitoUserAttribute({ Name: 'name', Value: fullname }),
        new CognitoUserAttribute({ Name: 'email', Value: email }),
    ];

    return new Promise((resolve, reject) => {
        Userpool.signUp(email, password, attributeList, null, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
};

export const signIn = (email, password) => {
    const user = new CognitoUser({
        username: email,
        pool: Userpool,
    });

    const authDetails = new AuthenticationDetails({
        username: email,
        password: password,
    });

    return new Promise((resolve, reject) => {
        user.authenticateUser(authDetails, {
            onSuccess: (data) => {
                resolve(data);
            },
            onFailure: (err) => {
                reject(err);
            }
        })
    })
}