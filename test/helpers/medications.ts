const attrs = ['name', 'meta.active'];

export const verifyMedication = (medication): void => {
  attrs.forEach(attr => {
    expect(medication)).toHaveProperty(attr);
  });
};

export const verifyResponse = (medication, payload): void => {
  attrs.forEach(attr => {
    expect(medication)[attr]).toEqual(payload[attr]);
  });
};
