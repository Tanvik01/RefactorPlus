export const PRESETS = [
  {
    id: 'react-flawed',
    title: 'React User Dashboard (Memory Leak & Re-renders)',
    language: 'jsx',
    category: 'React Dashboard',
    code: `import React, { useState, useEffect } from 'react';

export default function UserDashboard({ userId }) {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState('');

  // Issue: Missing dependency, un-cancelled async fetch, missing error handling
  useEffect(() => {
    fetch('/api/user/' + userId)
      .then(res => res.json())
      .then(data => setUser(data));

    fetch('/api/user/' + userId + '/posts')
      .then(res => res.json())
      .then(data => setPosts(data));
  }, []);

  // Issue: Re-calculating array filter on every render without useMemo
  const filteredPosts = posts.filter(post => {
    console.log('Filtering posts...');
    return post.title.toLowerCase().includes(filter.toLowerCase());
  });

  return (
    <div className="dashboard">
      <h2>{user ? user.name : 'Loading...'}</h2>
      <input 
        type="text" 
        value={filter} 
        onChange={(e) => setFilter(e.target.value)} 
        placeholder="Filter posts..." 
      />
      <ul>
        {filteredPosts.map(post => (
          <li key={Math.random()}>{post.title}</li>
        ))}
      </ul>
    </div>
  );
}`
  },
  {
    id: 'express-vulnerable',
    title: 'Node.js Express Controller (SQL Injection)',
    language: 'javascript',
    category: 'Node Controller',
    code: `import db from '../db.js';

// Route handler to fetch user profile and update role
export async function handleUpdateUserRole(req, res) {
  try {
    const { userId, newRole } = req.body;

    // CRITICAL SECURITY ISSUE: SQL Injection vulnerability via string concatenation
    const query = "UPDATE users SET role = '" + newRole + "' WHERE id = " + userId;
    
    const result = await db.query(query);

    // PERFORMANCE ISSUE: Fetching entire table after update instead of targeted query
    const allUsers = await db.query("SELECT * FROM users");
    const updatedUser = allUsers.find(u => u.id == userId);

    res.status(200).json({ success: true, user: updatedUser });
  } catch (err) {
    // SECURITY ISSUE: Leaking internal stack trace to client
    res.status(500).json({ error: err.stack });
  }
}`
  },
  {
    id: 'async-unoptimized',
    title: 'Async Data Fetcher (Sequential N+1 Waterfall)',
    language: 'javascript',
    category: 'Async Utility',
    code: `async function fetchTeamMemberDetails(teamMemberIds) {
  const results = [];

  // PERFORMANCE ISSUE: Sequential await inside loop causes massive waterfall delays
  for (let i = 0; i < teamMemberIds.length; i++) {
    const id = teamMemberIds[i];
    const profile = await fetch(\`https://api.example.com/users/\${id}\`).then(r => r.json());
    const stats = await fetch(\`https://api.example.com/users/\${id}/stats\`).then(r => r.json());
    
    results.push({
      id: id,
      name: profile.name,
      email: profile.email,
      score: stats.totalScore
    });
  }

  return results;
}`
  }
];
