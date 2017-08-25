// generated with yo auth-0 v0.1.1
exports.fetchUserProfile = function(accessToken, ctx, cb) {
  if (!ctx) {
    cb(new Error('BC-OA-0000: Invalid missing authentication information'), null)
    return;
  }

  var user = ctx.user;
  var tenant = ctx.team;

  if (!user) {
    cb(new Error('BC-SLK-0001: Missing user'), null)
    return;
  } if (!tenant) {
    cb(new Error('BC-SLK-0002: Missing tenant'), null)
  }

  var uid = user.id;
  var tid = tenant.id;

  if (!uid) {
    cb(new Error('BC-OA-0001: Missing user ID'), null)
  } if (!tid) {
    cb(new Error('BC-OA-0002: Missing tenant ID'), null)
  } else {
    var profile = {
      pro: 'slack',
      uid: uid,
      tid: tid,
      name: user.name,
      email: user.email
    };
    cb(null, profile);
  }
}
