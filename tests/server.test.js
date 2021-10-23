import { expect } from 'chai';
import server from '../server';

describe('Server', () => {
  it('test that server is running current port', async () => {
    expect(server.port.toString()).to.equal(process.env.PORT);
  });
});
