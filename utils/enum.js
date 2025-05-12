const BLOG_STATUS = Object.freeze({
  DRAFT: "draft",
  PENDING: "pending",
  PUBLISHED: "published",
  REJECTED: "rejected",
  ARCHIVED: "archived",
});

const ROLES = Object.freeze({
  SUPER_ADMIN: "super_admin", // can manega everything
  ADMIN: "admin", // can manage everything except super admin

  EDITOR: "editor", // can manage everything except super admin, admin and moderator
  MODERATOR: "moderator", // can manage all comments and blogs / wallpapers

  CONTRIBUTOR: "contributor", // can create blogs

  MEMBER: "member", // can read and comment on blogs/wallpapers also can download wallpapers

  GUEST: "guest", // can read blogs
  BANNED: "banned", // can not do anything
});

const ACTIONS = Object.freeze({
  // Blog actions
  CREATE_BLOG: "create_blog",
  UPDATE_BLOG: "update_blog",
  DELETE_BLOG: "delete_blog",
  PUBLISH_BLOG: "publish_blog",
  REVIEW_BLOG: "review_blog",
  // Comment actions
  CREATE_COMMENT: "create_comment",
  DELETE_COMMENT: "delete_comment",
  // Wallpaper actions
  UPLOAD_WALLPAPER: "upload_wallpaper",
  DELETE_WALLPAPER: "delete_wallpaper",
  DOWNLOAD_WALLPAPER: "download_wallpaper",
  // User & role management
  MANAGE_USERS: "manage_users",
  MANAGE_ROLES: "manage_roles",
  // Read actions
  READ_BLOG: "read_blog",
  READ_WALLPAPER: "read_wallpaper",
});

const ROLE_PERMISSION = Object.freeze({
  SUPER_ADMIN: [
    // Can do absolutely everything
    ...Object.values(ACTIONS),
  ],

  ADMIN: [
    // Everything except managing SUPER_ADMIN role
    ACTIONS.CREATE_BLOG,
    ACTIONS.UPDATE_BLOG,
    ACTIONS.DELETE_BLOG,
    ACTIONS.PUBLISH_BLOG,
    ACTIONS.REVIEW_BLOG,

    ACTIONS.CREATE_COMMENT,
    ACTIONS.DELETE_COMMENT,

    ACTIONS.UPLOAD_WALLPAPER,
    ACTIONS.DELETE_WALLPAPER,

    ACTIONS.DOWNLOAD_WALLPAPER,

    ACTIONS.MANAGE_USERS, // Can manage users
    // ACTIONS.MANAGE_ROLES // (excluded if you want to restrict SUPER_ADMIN role management)

    ACTIONS.READ_BLOG,
    ACTIONS.READ_WALLPAPER,
  ],

  EDITOR: [
    // Can manage content, but not users or high-level roles
    ACTIONS.CREATE_BLOG,
    ACTIONS.UPDATE_BLOG,
    ACTIONS.DELETE_BLOG,

    ACTIONS.CREATE_COMMENT,
    ACTIONS.DELETE_COMMENT,

    ACTIONS.UPLOAD_WALLPAPER,
    ACTIONS.DELETE_WALLPAPER,

    ACTIONS.DOWNLOAD_WALLPAPER,

    ACTIONS.READ_BLOG,
    ACTIONS.READ_WALLPAPER,
  ],

  MODERATOR: [
    // Can moderate comments and content
    ACTIONS.DELETE_BLOG,
    ACTIONS.REVIEW_BLOG,

    ACTIONS.CREATE_COMMENT,
    ACTIONS.DELETE_COMMENT,

    ACTIONS.DELETE_WALLPAPER,

    ACTIONS.READ_BLOG,
    ACTIONS.READ_WALLPAPER,
  ],

  CONTRIBUTOR: [
    // Can create blogs (goes into pending status)
    ACTIONS.CREATE_BLOG,

    ACTIONS.CREATE_COMMENT,

    ACTIONS.DOWNLOAD_WALLPAPER,

    ACTIONS.READ_BLOG,
    ACTIONS.READ_WALLPAPER,
  ],

  MEMBER: [
    // Can read & comment, and download wallpapers
    ACTIONS.CREATE_COMMENT,

    ACTIONS.DOWNLOAD_WALLPAPER,

    ACTIONS.READ_BLOG,
    ACTIONS.READ_WALLPAPER,
  ],

  GUEST: [
    // Can only read public content
    ACTIONS.READ_BLOG,
    ACTIONS.READ_WALLPAPER,
  ],

  BANNED: [
    // No permissions at all
    // empty
  ],
});

export { BLOG_STATUS, ROLES, ACTIONS, ROLE_PERMISSION };
