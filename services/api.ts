
export const API_URL = 'http://localhost/english_api';

export const saveScoreToDatabase = async (username: string, gameType: string, score: number) => {
  try {
    const response = await fetch(`${API_URL}/save_score.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        game_type: gameType,
        score: score
      }),
    });

    const result = await response.json();
    console.log('Save Score Result:', result);
    return result;
  } catch (error) {
    console.error('Error saving score to XAMPP:', error);
    // Không throw error để tránh làm gián đoạn trải nghiệm người dùng nếu server chưa bật
    return null;
  }
};
