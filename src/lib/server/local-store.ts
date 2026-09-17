import fs from 'node:fs';
import path from 'node:path';
import { randomUUID, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { MODULES } from '$lib/config/modules';
import { everyPermissionCode, rolePermissionCodes } from '$lib/config/permissions';
import { ROLES, type Role } from '$lib/types';
import { LOCAL_ADMIN_EMAIL, LOCAL_ADMIN_PASSWORD } from './config';

const allCodes = everyPermissionCode();

function getModuleLabel(module: string): string {
	return MODULES[module]?.label ?? module;
}

export interface LocalUser {
	id: string;
	email: string;
	full_name: string;
	role: Role;
	college_id: string | null;
	is_active: boolean;
	password_hash: string;
	password_salt: string;
	created_at: string;
}

interface StoreShape {
	version: number;
	collections: Record<string, Record<string, unknown>[]>;
	users: LocalUser[];
	sessions: Record<string, string>;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = process.env.LOCAL_DATA_FILE ?? path.join(DATA_DIR, 'erp-data.json');

let cache: StoreShape | null = null;

function nowIso() {
	return new Date().toISOString();
}

function hashPassword(password: string, salt = randomBytes(16).toString('hex')) {
	const hash = scryptSync(password, salt, 64).toString('hex');
	return { hash, salt };
}

function verifyPassword(password: string, salt: string, expected: string) {
	const hash = scryptSync(password, salt, 64);
	const expectedBuf = Buffer.from(expected, 'hex');
	if (hash.length !== expectedBuf.length) return false;
	return timingSafeEqual(hash, expectedBuf);
}

function seedData(): StoreShape {
	const collections: Record<string, Record<string, unknown>[]> = {};
	const collegeSeeds = [
		['COL001', 'Northbridge Institute', 'NBI', 'Ahmedabad', '#d96c45'],
		['COL002', 'Riverstone College', 'RSC', 'Vadodara', '#287d72'],
		['COL003', 'Aravalli School of Technology', 'AST', 'Gandhinagar', '#4e68a1'],
		['COL004', 'Westfield Arts & Commerce', 'WAC', 'Surat', '#b8893e'],
		['COL005', 'Cedar Grove University', 'CGU', 'Rajkot', '#795b8f']
	] as const;

	collections.colleges = collegeSeeds.map(([id, name, short, city, color]) => ({
		id,
		code: id,
		name,
		short_name: short,
		city,
		state: 'Gujarat',
		primary_color: color,
		timezone: 'Asia/Kolkata',
		currency: 'INR',
		academic_year: '2026-27',
		is_active: true,
		created_at: nowIso(),
		updated_at: nowIso()
	}));

	collections.academic_years = collegeSeeds.map(([id]) => ({
		id: randomUUID(),
		college_id: id,
		name: '2026-27',
		start_date: '2026-06-01',
		end_date: '2027-04-30',
		is_active: true,
		created_at: nowIso()
	}));

	const departmentNames = [
		['CE', 'Computer Engineering'],
		['CV', 'Civil Engineering'],
		['ME', 'Mechanical Engineering'],
		['MG', 'Management'],
		['SC', 'Science'],
		['CM', 'Commerce']
	] as const;

	collections.departments = collegeSeeds.flatMap(([collegeId]) =>
		departmentNames.map(([code, name], index) => ({
			id: randomUUID(),
			college_id: collegeId,
			code: `${code}${index + 1}`,
			name,
			short_name: code,
			status: 'Active',
			created_at: nowIso()
		}))
	);

	collections.programmes = collegeSeeds.flatMap(([collegeId]) => {
		const deps = collections.departments.filter((d) => d.college_id === collegeId);
		return deps.slice(0, 4).map((dep, index) => ({
			id: randomUUID(),
			college_id: collegeId,
			department_id: dep.id,
			code: `${dep.code}-P${index + 1}`,
			name: `${dep.name} Programme`,
			level: index === 3 ? 'PG' : 'UG',
			duration_years: index === 3 ? 2 : 4,
			total_semesters: index === 3 ? 4 : 8,
			university: 'State Technical University',
			status: 'Active',
			created_at: nowIso()
		}));
	});

	const permissions: Record<string, unknown>[] = [];
	for (const module of Object.values(MODULES)) {
		for (const action of PERMISSION_ACTIONS) {
			permissions.push({
				id: randomUUID(),
				code: `${module.key}:${action}`,
				module: module.key,
				action,
				label: `${action} ${module.label}`,
				created_at: nowIso()
			});
		}
	}
	collections.permissions = [...allCodes].map((code) => {
		const [module, action] = code.split(':');
		return {
			id: randomUUID(),
			code,
			module,
			action,
			label: `${action} ${getModuleLabel(module)}`,
			created_at: nowIso()
		};
	});

	const rolePermissions: Record<string, unknown>[] = [];
	for (const role of ROLES) {
		for (const code of rolePermissionCodes(role as Role)) {
			rolePermissions.push({ id: randomUUID(), role, permission_code: code, created_at: nowIso() });
		}
	}
	collections.role_permissions = rolePermissions;

	collections.roles = ROLES.map((role) => ({
		id: randomUUID(),
		code: role,
		name: role
			.split('_')
			.map((part) => part.charAt(0) + part.slice(1).toLowerCase())
			.join(' '),
		created_at: nowIso()
	}));

	const adminHash = hashPassword(LOCAL_ADMIN_PASSWORD);
	const collegePassword = hashPassword('college123');
	const users: LocalUser[] = [
		{
			id: randomUUID(),
			email: LOCAL_ADMIN_EMAIL.toLowerCase(),
			full_name: 'Super Administrator',
			role: 'SUPER_ADMIN',
			college_id: null,
			is_active: true,
			password_hash: adminHash.hash,
			password_salt: adminHash.salt,
			created_at: nowIso()
		},
		...collegeSeeds.map(([id, name], index) => {
			return {
				id: randomUUID(),
				email: `admin${index + 1}@college-erp.local`,
				full_name: `${name} Admin`,
				role: 'COLLEGE_ADMIN' as Role,
				college_id: id,
				is_active: true,
				password_hash: collegePassword.hash,
				password_salt: collegePassword.salt,
				created_at: nowIso()
			};
		})
	];

	return { version: 1, collections, users, sessions: {}, seededAt: nowIso() } as StoreShape;
}

function load(): StoreShape {
	if (cache) return cache;
	try {
		if (fs.existsSync(DATA_FILE)) {
			cache = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')) as StoreShape;
			if (!cache.collections) cache.collections = {};
			if (!cache.users) cache.users = [];
			if (!cache.sessions) cache.sessions = {};
			return cache;
		}
	} catch (error) {
		console.error('Local store is corrupt, re-seeding.', error);
	}
	cache = seedData();
	persist();
	return cache;
}

function persist() {
	if (!cache) return;
	fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
	fs.writeFileSync(DATA_FILE, JSON.stringify(cache, null, 2));
}

export function isLocalStoreEmpty() {
	const store = load();
	return store.users.length === 0;
}

export function collection(name: string): Record<string, unknown>[] {
	const store = load();
	if (!store.collections[name]) store.collections[name] = [];
	return store.collections[name];
}

export function persistStore() {
	persist();
}

export function allCollections() {
	return load().collections;
}

export function findUserByEmail(email: string): LocalUser | undefined {
	return load().users.find((user) => user.email.toLowerCase() === email.toLowerCase());
}

export function findUserById(id: string): LocalUser | undefined {
	return load().users.find((user) => user.id === id);
}

export function listUsers(): LocalUser[] {
	return load().users;
}

export function createUser(input: {
	email: string;
	full_name: string;
	role: Role;
	college_id: string | null;
	password: string;
}): LocalUser {
	const store = load();
	const { hash, salt } = hashPassword(input.password);
	const user: LocalUser = {
		id: randomUUID(),
		email: input.email.toLowerCase(),
		full_name: input.full_name,
		role: input.role,
		college_id: input.college_id,
		is_active: true,
		password_hash: hash,
		password_salt: salt,
		created_at: nowIso()
	};
	store.users.push(user);
	persist();
	return user;
}

export function authenticate(email: string, password: string): LocalUser | null {
	const store = load();
	const user = store.users.find((item) => item.email.toLowerCase() === email.toLowerCase());
	if (!user || !user.is_active) return null;
	if (!verifyPassword(password, user.password_salt, user.password_hash)) return null;
	return user;
}

export function setUserPassword(userId: string, password: string) {
	const store = load();
	const user = store.users.find((item) => item.id === userId);
	if (!user) return false;
	const { hash, salt } = hashPassword(password);
	user.password_hash = hash;
	user.password_salt = salt;
	persist();
	return true;
}

export function createSession(userId: string): string {
	const store = load();
	const token = randomBytes(32).toString('hex');
	store.sessions[token] = userId;
	persist();
	return token;
}

export function getSessionUser(token: string | undefined): LocalUser | null {
	if (!token) return null;
	const store = load();
	const userId = store.sessions[token];
	if (!userId) return null;
	const user = store.users.find((item) => item.id === userId);
	return user && user.is_active ? user : null;
}

export function deleteSession(token: string | undefined) {
	if (!token) return;
	const store = load();
	delete store.sessions[token];
	persist();
}

export interface LocalQuery {
	filters?: Record<string, unknown>;
	search?: string;
	searchFields?: string[];
	sort?: { column: string; ascending: boolean };
	page?: number;
	pageSize?: number;
}

function matchesFilters(row: Record<string, unknown>, filters: Record<string, unknown>): boolean {
	for (const [key, value] of Object.entries(filters)) {
		if (value === undefined) continue;
		if (Array.isArray(value)) {
			if (!value.includes(row[key])) return false;
			continue;
		}
		if (row[key] !== value) return false;
	}
	return true;
}

export function queryCollection(name: string, options: LocalQuery = {}) {
	const rows = collection(name);
	const filters = options.filters ?? {};
	const search = (options.search ?? '').trim().toLowerCase();
	const searchFields = options.searchFields ?? [];

	let result = rows.filter((row) => matchesFilters(row, filters));
	if (search) {
		result = result.filter((row) =>
			searchFields.some((field) =>
				String(row[field] ?? '')
					.toLowerCase()
					.includes(search)
			)
		);
	}

	const sort = options.sort;
	if (sort) {
		const dir = sort.ascending ? 1 : -1;
		result = [...result].sort((a, b) => {
			const av = a[sort.column];
			const bv = b[sort.column];
			if (av === bv) return 0;
			if (av === null || av === undefined) return 1;
			if (bv === null || bv === undefined) return -1;
			return av < bv ? -dir : dir;
		});
	}

	const total = result.length;
	const page = Math.max(1, options.page ?? 1);
	const pageSize = Math.max(1, options.pageSize ?? 25);
	const start = (page - 1) * pageSize;
	return { rows: result.slice(start, start + pageSize), total, page, pageSize };
}

export function findInCollection(name: string, id: string) {
	return collection(name).find((row) => row.id === id);
}

export function insertIntoCollection(name: string, row: Record<string, unknown>) {
	const rows = collection(name);
	const record = { id: randomUUID(), ...row };
	rows.push(record);
	persist();
	return record;
}

export function updateInCollection(name: string, id: string, patch: Record<string, unknown>) {
	const rows = collection(name);
	const index = rows.findIndex((row) => row.id === id);
	if (index === -1) return null;
	rows[index] = { ...rows[index], ...patch };
	persist();
	return rows[index];
}

export function removeFromCollection(name: string, id: string) {
	const rows = collection(name);
	const index = rows.findIndex((row) => row.id === id);
	if (index === -1) return false;
	rows.splice(index, 1);
	persist();
	return true;
}

export function nextSequence(name: string) {
	return collection(name).length + 1;
}
