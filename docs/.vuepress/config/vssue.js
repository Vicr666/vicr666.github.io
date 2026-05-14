module.exports = function createVssueOptions(locale) {
  return {
    owner: 'Vicr',
    repo: 'Wiki-Book-Talk',
    clientId: '0df327771daf7fce68df',
    clientSecret: '8cba9a84153c8b0cf30926244624665f987f8148',
    autoCreateIssue: true,
    locale: locale || 'zh-CN',
  };
};
