export type ID = number;

export type Timeframe = {
	start: Date,
	end: Date,
}

/** edit* can be new* by not specifying an ID */
// TODO: add upload image stuff
export class Client {
	constructor(baseURL: URL);

	readonly baseURL: URL;

	getFeeds(): Promise<Feed>;
	getAnnouncements(page: number, feed: ID): Promise<Iterable<Announcement>>;
	editAnnouncement(p: Announcement): Promise<void>;
	getBlogPosts(page: number): Promise<Iterable<BlogPost>>;
	editBlogPost(p: BlogPost): Promise<void>;
	getOrganizations(page: number): Promise<Iterable<Organization>>;
	editOrganizations(o: Organization): Promise<void>;
	getEvents(page: number): Promise<Iterable<Event>>;
	editEvent(e: Event): Promise<void>;
	getTerms(page: number): Promise<Iterable<Term>>;
	getCurrentTerm(): Promise<Term>;
	getUser(id: ID): Promise<User>;
	getStaff(): Promise<Iterable<Staff>>;
	editUser(u: User): Promise<void>;
	getTags(): Promise<Iterable<Tag>>;
	getFlatpage(slug: string): Promise<Flatpage>;
}

export interface Ref<I, A> {
	value: I;
	deref(client: Client): Promise<A>;
}

class Post {
	author: Ref<ID, User>;
	organization: Ref<ID, Organization>;
	tags: Array<ID, Tag>;

	status?: ApprovalStatus;
}

export class Announcement extends Post {
	supervisor?: Ref<ID, User>;
	rejectionReason?: string;
}

export class BlogPost extens Post {
	featuredImage: URL;
}

export const enum ApprovalStatus {
	Draft,
	Pending,
	Approved,
	Rejected,
}

export class Event {
	name: string;
	description: string;
	term: Ref<ID, Term>;
	organization: Ref<ID, Organization>;
	time: Timeframe;
	scheduleFormat?: string;
	instructional: boolean;
	public_: boolean;

	tags: Array<ID, Tag>;

	current(): boolean;
}

export interface Term {
	name: string;
	description: string;
	timetableFormat: TimetableFormat;
	startDate: Date;
	endDate: Date;
	frozen: boolean;

	daySchedule(date: Date): Array<ScheduledPeriod>;
}

export class ScheduledPeriod {
	description: string,
	time: Timeframe,
	position: number,
	cycle: string,
	course: string,
}

export interface Course {
	code: string;
	term: Ref<ID, Term>;
	description: string;
	position: number;

	submitter?: Ref<ID, User>;
}

export class TimetableFormat {
	slug: string,
	schedules: Record<string, Array<ScheduleFormat>>,
	courses: number,
	positions: Array<number>,
	cycle: { length: number, duration: string },
	question: { prompt: string, choices: Array<[number, string|number]> },
}

export class ScheduleFormat {
	description: { time: string, course: string },
	time: Array<[[number, number], [number, number]]>,
	position: Array<Array<number>>,
}

export class User {
	id: ID;
	slug: string,
	name: [string, string],
	bio: string,
	timezone: string,
	graduatingYear: number,
	organizations: Array<Ref<ID, Organization>>;
	following: Array<Ref<ID, Organization>>;
}

export class Staff {
	user: Ref<ID, User>;
	bio?: string;
	roles: Array<string>;
}

export class Tag {
	id: ID;
	name: string;
	color: string;
}

export class Flatpage {
	slug: string;
	content: string;
}

export class Feed {
	id: ID;
	name: string;
}
