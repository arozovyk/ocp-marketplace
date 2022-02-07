import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { getJsonAsync } from "./utils";
import { getSelectedAccount } from "./Web3Client";

const APIURL =
  "https://api.thegraph.com/subgraphs/name/arozovyk/nftmarketplace";

const tokensQuery = `
  query {
    users {
      id
      tokens {
        id
        contentURI
      }
    }
  }
`;
const client = new ApolloClient({
  uri: APIURL,
  cache: new InMemoryCache(),
});

export async function fetchNFTgraph() {
  let data2 = await client.query({
    query: gql(tokensQuery),
  });
  let selectedAddr = await getSelectedAccount();
  var acc = data2.data.users.filter((user) => {
    return user.id === selectedAddr;
  })[0];
  let userTokens = acc !== undefined ? acc.tokens : [];

  const items = await Promise.all(
    userTokens.map(async (i) => {
      const tokenUri = i.contentURI;
      const meta = await getJsonAsync(tokenUri);
      let item = {
        tokenId: i.id,
        owner: selectedAddr,
        image: meta.image,
        name: meta.name,
        description: meta.description,
      };
      return item;
    })
  );
  return items;
}
