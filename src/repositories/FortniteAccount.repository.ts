const { FORTNITE_API_URL, FORTNITE_API_TOKEN } = process.env;

interface FortniteApiResponse {
  status: number
  data: {
    account: {
      id: string
      name: string
    }
    battlePass: {
      level: number
      progress: number
    }
    stats: {
      all: {
        overall: {
          score: number
          scorePerMin: number
          scorePerMatch: number
          wins: number
          top3: number
          top5: number
          top6: number
          top10: number
          top12: number
          top25: number
          kills: number
          killsPerMin: number
          killsPerMatch: number
          deaths: number
          kd: number
          matches: number
          winRate: number
          minutesPlayed: number
          playersOutlived: number
          lastModified: string
        }
      }
    }
  }

}

type ForniteUserStats = FortniteApiResponse['data']['stats']['all']['overall'];

interface ForniteAccountInfo extends ForniteUserStats {
  account: FortniteApiResponse['data']['account']
  battlePass: FortniteApiResponse['data']['battlePass']
}

const isFortniteApiResponse = (value: any): value is FortniteApiResponse => (
  'status' in value && 'data' in value && 'stats' in value.data && 'all' in value.data.stats
  && 'overall' in value.data.stats.all
);

class FortniteAccountRepository {
  async findByUsername(username: string): Promise<ForniteAccountInfo | null> {
    if (!FORTNITE_API_URL || !FORTNITE_API_TOKEN) {
      throw new Error('Estão faltando as variáveis de ambientes: FORNITE_API_URL ou FORTNITE_API_TOKEN');
    }

    const response = await fetch(`${FORTNITE_API_URL}?name=${encodeURI(username)}&timeWindow=season`, {
      headers: {
        Authorization: FORTNITE_API_TOKEN,
      },
    });

    const data = await response.json() as FortniteApiResponse;

    if (!isFortniteApiResponse(data)) {
      return null;
    }

    const userInfo: ForniteAccountInfo = {
      ...data.data.stats.all.overall,
      account: data.data.account,
      battlePass: data.data.battlePass,
    };

    return userInfo;
  }
}

export default new FortniteAccountRepository();
