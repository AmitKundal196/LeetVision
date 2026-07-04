import axios from 'axios';

async function test() {
  const query = `
    query skillStats($username: String!) {
      matchedUser(username: $username) {
        tagProblemCounts {
          advanced { tagName tagSlug problemsSolved }
          intermediate { tagName tagSlug problemsSolved }
          fundamental { tagName tagSlug problemsSolved }
        }
      }
    }
  `;
  try {
    const res = await axios.post('https://leetcode.com/graphql', {
      query,
      variables: { username: 'amitkundal' } // or any public user like 'neal_wu'
    }, {
      headers: { 'Content-Type': 'application/json' }
    });
    console.log(JSON.stringify(res.data, null, 2));
  } catch(e) {
    console.error(e.response ? JSON.stringify(e.response.data, null, 2) : e.message);
  }
}
test();
