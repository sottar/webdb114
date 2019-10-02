const PATH = 'http://localhost:3001/';
const call = async (path: string) => {
  try {
    const res = await fetch(`${PATH}${path}`);
    return res;
  } catch (e) {
    return e;
  }
};

export { call };
