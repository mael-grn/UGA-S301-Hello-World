
import 'intersection-observer';
import { register, login, setLogin } from './DataProvider';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';

const mock = new MockAdapter(axios);

mock.onPost(`${process.env.REACT_APP_DB_URL}/register`).reply(200, {});

mock.onGet(`${process.env.REACT_APP_DB_URL}/user?login=login&password=12345&teacher=false`).reply(200, {});

mock.onPost(`${process.env.REACT_APP_DB_URL}/updateEleveLogin`).reply(200, {});

test('Test of register from dataprovider', () => {
  return register('Anna', 'Konda', '02/02/2005', false, '12345', true).then(result => {
    expect(result).toBe(true);
  });
});

test('Test of login from dataprovider', () => {
  console.log(`${process.env.REACT_APP_DB_URL}/user?login=login&password=12345&teacher=false`)
  return login('login', '12345').then(result => {
    expect(result).toBe(true);
  });
});

test('Test of setlogin from dataprovider', () => {
  return setLogin('firstLogin', 'secondLogin').then(result => {
    expect(result).toBe(true);
  });
});