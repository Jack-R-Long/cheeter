import requests
import os
import json

# To set your environment variables in your terminal run the following line:
# export 'BEARER_TOKEN'='<your_bearer_token>'
bearer_token = "AAAAAAAAAAAAAAAAAAAAAKtZlQEAAAAAjn%2Bjle3MNVp%2BVUKkmtQUth4Wzmw%3DZXxzeZiuXnmdjBXrKhuZClckDLpAD7paK4kRSPzLsbKk8ZbD3Z"
CQBrownID = "1290733239146033155"
tweets = []

def create_url():
    # Replace with user ID below
    user_id = 1290733239146033155
    return "https://api.twitter.com/2/users/{}/tweets?".format(user_id)


def get_params(until_id=None):
    # Tweet fields are adjustable.
    # Options include:
    # attachments, author_id, context_annotations,
    # conversation_id, created_at, entities, geo, id,
    # in_reply_to_user_id, lang, non_public_metrics, organic_metrics,
    # possibly_sensitive, promoted_metrics, public_metrics, referenced_tweets,
    # source, text, and withheld
    if until_id is not None:
        return {"tweet.fields": "created_at,source", "max_results": "100", "until_id": f"{until_id}"}
    else:
        return {"tweet.fields": "created_at,source", "max_results": "100"}


def bearer_oauth(r):
    """
    Method required by bearer token authentication.
    """

    r.headers["Authorization"] = f"Bearer {bearer_token}"
    r.headers["User-Agent"] = "v2UserTweetsPython"
    return r


def connect_to_endpoint(url, params):
    response = requests.request("GET", url, auth=bearer_oauth, params=params)
    print(response.status_code)
    if response.status_code != 200:
        raise Exception(
            "Request returned an error: {} {}".format(
                response.status_code, response.text
            )
        )
    return response.json()


def main():
    # Get initial 100 tweets
    url = create_url()
    params = get_params()
    json_response = connect_to_endpoint(url, params)
    old_id = json_response['meta']['oldest_id']
    print(json_response['data'][-1])
    print(old_id)
    #print(json.dumps(json_response, indent=4, sort_keys=True))
    tweets.extend(json_response['data'])

    while(len(tweets)<3100):
        print("TWEETS SCRAPED = {}".format(len(tweets)))

        url = create_url()
        params = get_params(old_id)
        json_response = connect_to_endpoint(url, params)
        if json_response['meta']['result_count'] == 0:
            break
        try:
            old_id = json_response['meta']['oldest_id']
        except Exception as e:
            print(json.dumps(json_response, indent=4, sort_keys=True))
        print(json_response['data'][-1])
        print("The new until_id to be used: {}".format(old_id))
        #print(json.dumps(json_response, indent=4, sort_keys=True))
        tweets.extend(json_response['data'])

    with open('tweets_pretty.json', 'w', encoding='utf-8') as f:
        json.dump(tweets, f, ensure_ascii=False, indent=4)


if __name__ == "__main__":
    main()