'use strict';

module.exports = function registerClassroomRoutes(app, { authDb }) {

    // Helper: require Gold plan for teacher endpoints
    function _requireGold(req, res, next) {
        const plan = req.jwtUser?.plan;
        // Acceso al rol de Profesor: plan Gold asignado por admin, o el addon ClassRooms
        // contratado sobre un plan pago existente (Premium/Oro/Contributor) — ver setClassroomAddon.
        if (plan !== 'gold' && !req.jwtUser?.classroomAddon && !req.jwtUser?.isDev) {
            return res.status(403).json({ error: 'Se requiere el plan Gold o el addon ClassRooms para acceder a esta función.' });
        }
        next();
    }

    function _requirePremiumOrGold(req, res, next) {
        const plan = req.jwtUser?.plan;
        if (plan !== 'premium' && plan !== 'gold' && !req.jwtUser?.isDev) {
            return res.status(403).json({ error: 'Se requiere al menos el plan Premium.' });
        }
        next();
    }

    // Check if user is member of class (student or teacher)
    function _classAccess(classId, userId) {
        const cls = authDb.db.prepare('SELECT * FROM classes WHERE id = ?').get(classId);
        if (!cls) return null;
        if (cls.teacher_id === userId) return { role: 'teacher', cls };
        const enrollment = authDb.db.prepare('SELECT * FROM class_students WHERE class_id = ? AND student_id = ? AND status = ?').get(classId, userId, 'active');
        if (enrollment) return { role: 'student', cls };
        return null;
    }

    // ── Teacher profile ──────────────────────────────────────────
    app.get('/classroom/teacher/profile', authDb.verifyToken, (req, res) => {
        const profile = authDb.getTeacherProfile(req.jwtUser.id);
        res.json({ profile: profile || null });
    });

    app.post('/classroom/teacher/profile', authDb.verifyToken, _requireGold, (req, res) => {
        const { bio, targetLangs, status } = req.body;
        const profile = authDb.upsertTeacherProfile(req.jwtUser.id, { bio, targetLangs, status });
        res.json({ ok: true, profile });
    });

    // ── Teacher directory (for students) ────────────────────────
    app.get('/classroom/teachers', authDb.verifyToken, _requirePremiumOrGold, (req, res) => {
        const { lang } = req.query;
        const teachers = authDb.listTeachers(lang || null);
        res.json({ teachers });
    });

    app.get('/classroom/teachers/:id', authDb.verifyToken, _requirePremiumOrGold, (req, res) => {
        const profile = authDb.getTeacherProfile(req.params.id);
        if (!profile) return res.status(404).json({ error: 'Profesor no encontrado' });
        const classes = authDb.db.prepare('SELECT id, name, target_lang, source_lang FROM classes WHERE teacher_id = ?').all(req.params.id);
        res.json({ profile, classes });
    });

    // ── Class management (teacher) ───────────────────────────────
    app.post('/classroom/classes', authDb.verifyToken, _requireGold, (req, res) => {
        const { name, targetLang, sourceLang } = req.body;
        if (!name?.trim() || !targetLang) return res.status(400).json({ error: 'Nombre e idioma son obligatorios' });
        const cls = authDb.createClass(req.jwtUser.id, { name: name.trim(), targetLang, sourceLang });
        res.json({ ok: true, class: cls });
    });

    app.get('/classroom/classes', authDb.verifyToken, _requireGold, (req, res) => {
        const classes = authDb.getTeacherClasses(req.jwtUser.id);
        res.json({ classes });
    });

    app.delete('/classroom/classes/:id', authDb.verifyToken, _requireGold, (req, res) => {
        const result = authDb.deleteClass(req.params.id, req.jwtUser.id);
        res.json(result);
    });

    // Teacher adds student by username
    app.post('/classroom/classes/:id/students', authDb.verifyToken, _requireGold, (req, res) => {
        const { username } = req.body;
        if (!username?.trim()) return res.status(400).json({ error: 'Falta el nombre de usuario' });
        const result = authDb.addStudentByUsername(req.params.id, req.jwtUser.id, username.trim());
        res.json(result);
    });

    // Teacher removes student
    app.delete('/classroom/classes/:id/students/:studentId', authDb.verifyToken, _requireGold, (req, res) => {
        const result = authDb.removeStudentFromClass(req.params.id, req.jwtUser.id, req.params.studentId);
        res.json(result);
    });

    // Teacher responds to join request
    app.post('/classroom/classes/:id/respond', authDb.verifyToken, _requireGold, (req, res) => {
        const { studentId, accept } = req.body;
        if (!studentId) return res.status(400).json({ error: 'Falta studentId' });
        const result = authDb.respondToRequest(req.params.id, req.jwtUser.id, studentId, !!accept);
        res.json(result);
    });

    // ── Student enrollment ───────────────────────────────────────
    app.get('/classroom/my-enrollment', authDb.verifyToken, _requirePremiumOrGold, (req, res) => {
        const enrollments = authDb.getStudentEnrollment(req.jwtUser.id);
        res.json({ enrollments });
    });

    // Student requests to join a teacher's class
    app.post('/classroom/request/:teacherId', authDb.verifyToken, _requirePremiumOrGold, (req, res) => {
        if (req.params.teacherId === req.jwtUser.id) return res.status(400).json({ error: 'No podés unirte a tu propia clase' });
        const result = authDb.requestJoinClass(req.params.teacherId, req.jwtUser.id);
        res.json(result);
    });

    // ── Messages ─────────────────────────────────────────────────
    app.get('/classroom/messages/:classId', authDb.verifyToken, _requirePremiumOrGold, (req, res) => {
        const access = _classAccess(req.params.classId, req.jwtUser.id);
        if (!access) return res.status(403).json({ error: 'No tenés acceso a esta clase' });
        const msgs = authDb.getClassMessages(req.params.classId, 60);
        res.json({ messages: msgs });
    });

    app.post('/classroom/messages/:classId', authDb.verifyToken, _requirePremiumOrGold, (req, res) => {
        const access = _classAccess(req.params.classId, req.jwtUser.id);
        if (!access) return res.status(403).json({ error: 'No tenés acceso a esta clase' });
        const { content } = req.body;
        if (!content?.trim()) return res.status(400).json({ error: 'Mensaje vacío' });
        const msg = authDb.sendMessage(req.params.classId, req.jwtUser.id, content.trim(), false, null);
        res.json({ ok: true, message: msg });
    });

    app.get('/classroom/messages/:classId/dm/:userId', authDb.verifyToken, _requirePremiumOrGold, (req, res) => {
        const access = _classAccess(req.params.classId, req.jwtUser.id);
        if (!access) return res.status(403).json({ error: 'No tenés acceso a esta clase' });
        const msgs = authDb.getDMMessages(req.params.classId, req.jwtUser.id, req.params.userId);
        res.json({ messages: msgs });
    });

    app.post('/classroom/messages/:classId/dm/:userId', authDb.verifyToken, _requirePremiumOrGold, (req, res) => {
        const access = _classAccess(req.params.classId, req.jwtUser.id);
        if (!access) return res.status(403).json({ error: 'No tenés acceso a esta clase' });
        const { content } = req.body;
        if (!content?.trim()) return res.status(400).json({ error: 'Mensaje vacío' });
        const msg = authDb.sendMessage(req.params.classId, req.jwtUser.id, content.trim(), true, req.params.userId);
        res.json({ ok: true, message: msg });
    });

    // ── Notifications ────────────────────────────────────────────
    app.get('/classroom/notifications', authDb.verifyToken, (req, res) => {
        const notifs = authDb.getUserNotifications(req.jwtUser.id);
        const unread = authDb.getUnreadCount(req.jwtUser.id);
        res.json({ notifications: notifs, unread });
    });

    app.post('/classroom/notifications/:id/read', authDb.verifyToken, (req, res) => {
        authDb.markNotifRead(req.params.id, req.jwtUser.id);
        res.json({ ok: true });
    });

    // ── Ratings ──────────────────────────────────────────────────
    app.post('/classroom/rate/:teacherId', authDb.verifyToken, _requirePremiumOrGold, (req, res) => {
        const { score, comment } = req.body;
        if (!score || score < 1 || score > 5) return res.status(400).json({ error: 'Score debe ser entre 1 y 5' });
        const result = authDb.rateTeacher(req.params.teacherId, req.jwtUser.id, score, comment || '');
        res.json(result);
    });

    // ── Notificaciones programadas (daily tip, subscription reminder) ──
    app.post('/notifications/check', authDb.verifyToken, (req, res) => {
        authDb.checkScheduledNotifications(req.jwtUser.id);
        res.json({ ok: true });
    });

    // ── Unread count (badge) ─────────────────────────────────────
    app.get('/classroom/unread', authDb.verifyToken, (req, res) => {
        res.json({ unread: authDb.getUnreadCount(req.jwtUser.id) });
    });

    // ── Announcements (Calendario) ───────────────────────────────
    app.get('/classroom/classes/:id/announcements', authDb.verifyToken, _requirePremiumOrGold, (req, res) => {
        const access = _classAccess(req.params.id, req.jwtUser.id);
        if (!access) return res.status(403).json({ error: 'Sin acceso' });
        res.json({ announcements: authDb.getAnnouncements(req.params.id) });
    });

    app.post('/classroom/classes/:id/announcements', authDb.verifyToken, _requireGold, (req, res) => {
        const cls = authDb.db.prepare('SELECT * FROM classes WHERE id = ? AND teacher_id = ?').get(req.params.id, req.jwtUser.id);
        if (!cls) return res.status(403).json({ error: 'No sos el profesor de esta clase' });
        const { title, body, dueDate } = req.body;
        if (!title?.trim()) return res.status(400).json({ error: 'El título es obligatorio' });
        const ann = authDb.createAnnouncement(req.params.id, req.jwtUser.id, { title: title.trim(), body: body || '', dueDate: dueDate || null });
        res.json({ ok: true, announcement: ann });
    });

    app.delete('/classroom/classes/:id/announcements/:annId', authDb.verifyToken, _requireGold, (req, res) => {
        const result = authDb.deleteAnnouncement(req.params.annId, req.jwtUser.id);
        res.json(result);
    });

};
