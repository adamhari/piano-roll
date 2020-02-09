export const getSetterFromString = str => 'set' + str.replace(/^\w/, c => c.toUpperCase());
