// generated with yo auth-0 v0.1.1
exports.fetchUserProfile = function(accessToken, ctx, cb) {
  if (!ctx) {
    cb(new Error('BC-OA-0000: Invalid missing authentication information'), null)
    return;
  }

  var uid =ctx. user_id;
  var tid = ctx.team_id;

  if (!uid) {
    cb(new Error('BC-OA-0001: Missing user ID'), null)
  } else if (!tid) {
    cb(new Error('BC-OA-0002: Missing tenant ID'), null)
  } else {
    var profile = {
      pro: 'slack',
      uid: uid,
      tid: tid,
    };
    cb(null, profile);
  }
}
