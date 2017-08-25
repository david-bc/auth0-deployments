// THIS IS ONLY A TEST


exports.fetchUserProfile = function(accessToken, ctx, cb) {
  if (!ctx.user) {
    cb(new Error('BC-SLK-0000: Missing User Object'), null)
  } else if (!ctx.user.id) {
    cb(new Error('BC-OA-0000: Missing user ID'), null)
  } else if (!ctx.team) {
    cb(new Error('BC-SLK-0001: Missing Team/Tenant Object'), null)
  } else if (!ctx.team.id) {
    cb(new Error('BC-OA-0001: Missing tenant ID'), null)
  }

  var profile = {
    pro: 'slack',
    uid: ctx.user.id,
    tid: ctx.team.id,
    name: ctx.user.name,
    email: ctx.user.email
  };
  cb(null, profile);
}
