require("dotenv").config();

const mysql = require("mysql2");

const state = {
  useFallback: false,
  store: {
    users: [],
    projects: [],
    tasks: [],
    team_members: [],
    notifications: []
  },
  nextIds: { users: 1, projects: 1, tasks: 1, team_members: 1, notifications: 1 }
};

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

function fallbackQuery(sql, params, callback) {
  if (typeof params === "function") {
    callback = params;
    params = [];
  }

  const normalized = sql.trim().replace(/\s+/g, " ").toLowerCase();

  if (normalized.startsWith("select id from users where email = ?")) {
    const email = params[0];
    const matches = state.store.users.filter((user) => user.email === email);
    return callback(null, matches);
  }

  if (normalized.startsWith("select * from users where email = ?")) {
    const email = params[0];
    const matches = state.store.users.filter((user) => user.email === email);
    return callback(null, matches);
  }

  if (normalized.startsWith("insert into users")) {
    const [name, email, password] = params;
    const user = { id: state.nextIds.users++, name, email, password, created_at: new Date().toISOString() };
    state.store.users.push(user);
    return callback(null, { insertId: user.id, affectedRows: 1 });
  }

  if (normalized.startsWith("select p.*, u.name as owner_name from projects p")) {
    const userId = params[0];
    const projects = state.store.projects.filter((project) => project.created_by === userId).map((project) => ({ ...project, owner_name: state.store.users.find((user) => user.id === project.created_by)?.name || "" }));
    return callback(null, projects.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
  }

  if (normalized.startsWith("insert into projects")) {
    const [name, description, status, progress, deadline, createdBy] = params;
    const project = { id: state.nextIds.projects++, name, description, status, progress, deadline, created_by: createdBy, created_at: new Date().toISOString() };
    state.store.projects.push(project);
    return callback(null, { insertId: project.id, affectedRows: 1 });
  }

  if (normalized.startsWith("update projects set")) {
    const [name, description, status, progress, deadline, id, userId] = params;
    const index = state.store.projects.findIndex((project) => project.id === id && project.created_by === userId);
    if (index === -1) return callback(null, { affectedRows: 0 });
    state.store.projects[index] = { ...state.store.projects[index], name, description, status, progress, deadline };
    return callback(null, { affectedRows: 1 });
  }

  if (normalized.startsWith("delete from projects")) {
    const [id, userId] = params;
    const beforeLength = state.store.projects.length;
    state.store.projects = state.store.projects.filter((project) => !(project.id === id && project.created_by === userId));
    return callback(null, { affectedRows: beforeLength === state.store.projects.length ? 0 : 1 });
  }

  if (normalized.startsWith("select t.*, p.name as project_name from tasks t")) {
    const userId = params[0];
    const projectId = params[1];
    const tasks = state.store.tasks.filter((task) => task.user_id === userId && (!projectId || task.project_id === projectId)).map((task) => ({ ...task, project_name: state.store.projects.find((project) => project.id === task.project_id)?.name || "" }));
    return callback(null, tasks.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
  }

  if (normalized.startsWith("insert into tasks")) {
    const [title, description, projectId, userId, priority, dueDate, progress, status] = params;
    const task = { id: state.nextIds.tasks++, title, description, project_id: projectId, user_id: userId, priority, due_date: dueDate, progress, status, created_at: new Date().toISOString() };
    state.store.tasks.push(task);
    return callback(null, { insertId: task.id, affectedRows: 1 });
  }

  if (normalized.startsWith("update tasks set")) {
    const [title, description, priority, dueDate, progress, status, id, userId] = params;
    const index = state.store.tasks.findIndex((task) => task.id === id && task.user_id === userId);
    if (index === -1) return callback(null, { affectedRows: 0 });
    state.store.tasks[index] = { ...state.store.tasks[index], title, description, priority, due_date: dueDate, progress, status };
    return callback(null, { affectedRows: 1 });
  }

  if (normalized.startsWith("delete from tasks")) {
    const [id, userId] = params;
    const beforeLength = state.store.tasks.length;
    state.store.tasks = state.store.tasks.filter((task) => !(task.id === id && task.user_id === userId));
    return callback(null, { affectedRows: beforeLength === state.store.tasks.length ? 0 : 1 });
  }

  if (normalized.startsWith("select id, name, email, role from team_members where user_id = ?")) {
    const userId = params[0];
    const members = state.store.team_members.filter((member) => member.user_id === userId);
    return callback(null, members);
  }

  if (normalized.startsWith("insert into team_members")) {
    const [userId, name, email, role] = params;
    const member = { id: state.nextIds.team_members++, user_id: userId, name, email, role, created_at: new Date().toISOString() };
    state.store.team_members.push(member);
    return callback(null, { insertId: member.id, affectedRows: 1 });
  }

  if (normalized.startsWith("delete from team_members")) {
    const [id, userId] = params;
    const beforeLength = state.store.team_members.length;
    state.store.team_members = state.store.team_members.filter((member) => !(member.id === id && member.user_id === userId));
    return callback(null, { affectedRows: beforeLength === state.store.team_members.length ? 0 : 1 });
  }

  if (normalized.startsWith("select * from notifications where user_id = ?")) {
    const userId = params[0];
    const notifications = state.store.notifications.filter((notification) => notification.user_id === userId);
    return callback(null, notifications.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
  }

  if (normalized.startsWith("insert into notifications")) {
    const [userId, title, message, type] = params;
    const notification = { id: state.nextIds.notifications++, user_id: userId, title, message, type, created_at: new Date().toISOString() };
    state.store.notifications.push(notification);
    return callback(null, { insertId: notification.id, affectedRows: 1 });
  }

  if (normalized.startsWith("delete from notifications")) {
    const [id, userId] = params;
    const beforeLength = state.store.notifications.length;
    state.store.notifications = state.store.notifications.filter((notification) => !(notification.id === id && notification.user_id === userId));
    return callback(null, { affectedRows: beforeLength === state.store.notifications.length ? 0 : 1 });
  }

  if (normalized.startsWith("select count(*) as totalprojects from projects where created_by = ?")) {
    const userId = params[0];
    return callback(null, [{ totalProjects: state.store.projects.filter((project) => project.created_by === userId).length }]);
  }

  if (normalized.startsWith("select count(*) as totaltasks from tasks where user_id = ?")) {
    const userId = params[0];
    return callback(null, [{ totalTasks: state.store.tasks.filter((task) => task.user_id === userId).length }]);
  }

  if (normalized.startsWith("select count(*) as completedtasks from tasks where user_id = ? and status = 'completed'")) {
    const userId = params[0];
    return callback(null, [{ completedTasks: state.store.tasks.filter((task) => task.user_id === userId && task.status === "Completed").length }]);
  }

  callback(new Error("Unsupported fallback query"));
}

const db = {
  query(sql, params, callback) {
    if (typeof params === "function") {
      callback = params;
      params = [];
    }
    if (state.useFallback) {
      return fallbackQuery(sql, params, callback);
    }

    return connection.query(sql, params, (err, results, fields) => {
      if (err && !state.useFallback) {
        const fallbackCodes = ["ER_ACCESS_DENIED_ERROR", "ECONNREFUSED", "ER_BAD_DB_ERROR", "PROTOCOL_CONNECTION_LOST"];
        if (fallbackCodes.includes(err.code)) {
          state.useFallback = true;
          return fallbackQuery(sql, params, callback);
        }
      }
      callback(err, results, fields);
    });
  }
};

connection.connect((err) => {
  if (err) {
    state.useFallback = true;
    console.log("MySQL unavailable, using in-memory fallback store");
  } else {
    console.log("MySQL Connected");
  }
});

module.exports = db;