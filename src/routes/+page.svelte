<script lang="ts">
	const stats = [
		{ label: 'Total Students', value: '12,486', meta: '+8.4% vs last term', icon: '👩‍🎓' },
		{ label: 'Departments', value: '48', meta: 'Across 5 colleges', icon: '🏫' },
		{ label: 'Fee Collection', value: '₹48.6L', meta: '92% of target', icon: '💰' },
		{ label: 'Faculty', value: '642', meta: '18 new hires', icon: '👨‍🏫' }
	];

	const colleges = [
		{ name: 'Atlas College', short: 'ATL', students: '2,940', city: 'Ahmedabad', color: '#2954a6' },
		{ name: 'Riverstone College', short: 'RSC', students: '2,610', city: 'Vadodara', color: '#287d72' },
		{ name: 'Greenfield Institute', short: 'GFI', students: '2,430', city: 'Surat', color: '#8a5cf6' },
		{ name: 'Summit Academy', short: 'SUM', students: '2,180', city: 'Rajkot', color: '#df8f14' },
		{ name: 'Horizon Campus', short: 'HRC', students: '2,326', city: 'Gandhinagar', color: '#d14b68' }
	];

	const quickActions = [
		{ title: 'Create admission', icon: '📝', description: 'Register new students and assign courses.' },
		{ title: 'Review fee dues', icon: '📊', description: 'Track pending fees and payment status.' },
		{ title: 'Approve leave', icon: '✅', description: 'Manage staff and faculty leave requests.' },
		{ title: 'Open timetable', icon: '🗓️', description: 'Coordinate classes, labs, and exam slots.' }
	];

	const alerts = [
		'Academic year finalization is pending for 3 departments.',
		'23 fee reminders are scheduled for today.',
		'Inventory reorder requested for chemistry labs.'
	];
</script>

<svelte:head>
	<title>Atlas College ERP</title>
	<meta
		name="description"
		content="Atlas College ERP dashboard for admissions, academics, attendance, fees, HR, library, and reports."
	/>
</svelte:head>

<div class="app-shell">
	<main class="app-main">
		<div class="app-content">
			<header class="page-header">
				<div>
					<p class="eyebrow">Multi-college operations overview</p>
					<h1 class="page-title">Atlas College ERP</h1>
					<p class="page-subtitle">
						Admissions, academics, attendance, fees, HR, library and reporting across five campuses.
					</p>
				</div>
				<div class="row wrap">
					<button class="btn btn-secondary">Export report</button>
					<button class="btn btn-primary">New enrollment</button>
				</div>
			</header>

			<section class="grid cols-4">
				{#each stats as stat}
					<article class="card stat">
						<div class="stat-label">{stat.label}</div>
						<div class="stat-value">{stat.value}</div>
						<div class="stat-meta">{stat.meta}</div>
						<div class="stat-icon">{stat.icon}</div>
					</article>
				{/each}
			</section>

			<section class="dashboard-grid">
				<article class="card">
					<div class="card-header">
						<h3>Colleges</h3>
						<button class="btn btn-sm btn-secondary">Manage</button>
					</div>
					<div class="card-body">
						<div class="college-list">
							{#each colleges as college}
								<div class="college-card" style={`--brand-color: ${college.color}`}>
									<div class="brandbar">
										<span class="brandmark">{college.short}</span>
									</div>
									<div class="college-row">
										<div>
											<h4>{college.name}</h4>
											<p>{college.city}</p>
										</div>
										<strong>{college.students}</strong>
									</div>
								</div>
							{/each}
						</div>
					</div>
				</article>

				<article class="card">
					<div class="card-header">
						<h3>Priority alerts</h3>
						<span class="pill">Live</span>
					</div>
					<div class="card-body">
						<ul class="alert-list">
							{#each alerts as alert}
								<li>{alert}</li>
							{/each}
						</ul>
					</div>
				</article>
			</section>

			<section class="grid cols-4">
				{#each quickActions as action}
					<article class="card action-card">
						<div class="action-icon">{action.icon}</div>
						<h3>{action.title}</h3>
						<p>{action.description}</p>
					</article>
				{/each}
			</section>
		</div>
	</main>
</div>
