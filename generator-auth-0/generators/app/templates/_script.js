// generated with yo auth-0 v<%= version %>
exports.fetchUserProfile = function(accessToken, ctx, cb) {
  if (!ctx) {
    cb(new Error('BC-OA-0000: Invalid missing authentication information'), null)
    return;
  }

  var uid = ctx.userId;
  var tid = ctx.tenantId;

  if (!uid) {
    cb(new Error('BC-OA-0001: Missing user ID'), null)
  } if (!tid) {
    cb(new Error('BC-OA-0002: Missing tenant ID'), null)
  } else {
    var profile = {
      pro: '<%= name %>',
      uid: uid,
      tid: tid,
      name: ctx.name,
      email: ctx.email
    };
    cb(null, profile);
  }
}
