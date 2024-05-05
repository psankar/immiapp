# Immi Trends Calculation

I am trying to build a microblogging website/app for Indian languages as a hobby project. Something like mastodon or twitter or threads but not with as big aspirations. It is more a fun hobby project for not losing touch with programming. Pre-registered users can come and post messages here which are called Immis. Immi in Tamil means a small quantity.

When users post messages, we need to identify Trending Topics from the body of the message. The way in which the trends are going to be identified is:

I have the following postgresql tables:

```sql
immis(id int, author_id int, body text, created_at timestamp);
token_runs(run_minute timestamp, token text, num_immis int);
token_baselines(token text, baseline int/float);
```

immis is the master table where every message by any user will be saved, along with the author_id and the timestamp. Each message gets an unique id (number here for brevity, but could actually be a text too)

Now there is a second table called token_runs, where I parse all the immis that have been created in an one minute interval. Let us take the below immis as an example:

## Sample data

```csv
id, author_id, body, created_at
1, 1, CSK are through to yet another IPL final, 7:00:00PM
2, 2, CSK makes it to the IPL finals once again, 7:00:25PM
3, 3, Go's biggest contribution to the world is gofmt, 7:01:09PM
4, 1, Betting is illegal in India otherwise would have put money on CSK reaching finals, 7:01:40PM
5, 4, Paul Graham writes good essays. I wonder what he majored in college., 7:02:03PM
6, 1, CSK CSK CSK, 7:02:57PM
7, 3, I wish a framework like Ruby on rails or django exists for Go, 7:02:57PM
8, 3, பேர்தான் சிலு'வை', வைக்கவே முடிவதில்லை., 7:03:40PM
9, 4, boooo, 7:04:00PM
10, 5, I threw the empty milk carton across the kitchen and daughter gave live commentary "Steph Curry from downtown with another 3 pointer", 7:10:13PM
```

There are 5 users as we can see from the messages.

- User 1 is a CSK fan lauding some IPL victory that took CSK team to a final, and posting multiple immis (1,4,6) about it
- User 2 too talks about CSK
- User 3 talks about Golang (3,7,8) and also has a Tamil Immi
- User 4 is having fun on random topics
- User 5 is having some good family time

## Token logic

Now let us take a sample message `CSK are through to yet another IPL final` and we will try to identify what are the tokens in it. They would be:

```
CSK
CSK are
CSK are through
are
are through
are through to
through
through to
through to yet
< ... so on until ... >
another IPL
another IPL final
IPL
IPL final
final
```

A token would be at minimum one word and could be a maximum of 3 contiguous words. For brevity, let us consider the case of all the words in an Immi to be only English characters. The logic is extendable to all scripts though.

Similarly let us leave the case of punctuations, multiple whitespaces and other such corner cases out of the scope of this.

## Tokenization

Now for each immi, we need to tokenize like above and save it on the `tokens` table. There is a token_run which is done every minute, (7:00, 7:01, 7:02, 7:03 etc.) on all the Immis that were created_at a full three minutes before the current run. So, in our example, on the token_run at 7:03 Immis 1,2 will be tokenized (From 7:00:00 to 7:00:59). On the token_run at 7:04, the Immis 3,4 will be tokenized. On the token_run at 7:05, the Immis 5,6,7 will be tokenized. On the token_run at 7:06, the Immis 8,9 will be tokenized. The 10th Immi will be tokenized only on the 7:13th run.

Now if a token exists in multiple Immis, then the immis_count for that particular token will be incremented by 1 for each occurence in an Immi. It is irrelevant how many times the token appears in a single Immi. What matters is only the number of Immis that have the same token in a token_run.

With the above definition, we would have in the tokens table for example:

```csv
"7:03", "IPL", 2
"7:03", "CSK", 2
"7:03", "to", 2
"7:03", "final", 1
"7:03", "finals", 1
```

where the 2 comes from the Immis 1 and 2, both of which have the tokens "IPL", "CSK" and "to". However "final" and "finals" appear only in one such Immi. The above is a sample of tokens but all the tokens would be generated and their immi_count will be updated as per the occurence.

## At Scale

So once we have the above tokenizing logic implemented, and when we get millions of Immis (theoretical at the moment as we do not even have 1 user yet) from a few thousands of active users at any point of time, the tokenizer will start filling up the tokens table.

And with a million row sample dataset, I have identified some oft-repeated patterns of multi-word tokens, like:

"I am", "in order to", "remember that" etc. that occur frequently

and some single-word tokens like:

"I", "and", "you", "is", "are", "ஒரு", "இது" etc. that occur frequently.

## Trends and Baseline Identification

Now we need to identify some kind of a baseline for the occurence of each token. If a 100 Immis are made in a minute, atleast 50 may have "is" and atleast 60 may have "this". So these tokens should have a higher value for their baseline. So these words should never be identified as "Trends". Only the tokens that suddenly go above the baseline for that token should be considered a "Trending Topic" (a trending token).

Like for example, if a cricket match is happening and suddenly "Mahendra Singh Dhoni" does an extra-ordinary stumping then a few thousand users suddenly post "Mahendra Singh Dhoni" or "MSD" or "Dhoni" then these tokens should be identified as Trends. But there may be some people who may be always talking about Dhoni or JustinBieber or TaylowSwift which should not be considered as a Trend. These tokens should just have a high baseline (but not higher than the baseline value for say "is" or "are").

Irrespective of if a token is trending or not, the baseline value for a token must get updated. Otherwise, we run into many risks related to Trends. For example, if we set the baseline value as very high for "Mahendra Singh Dhoni" because he got trended in a game, but not reduce the token's baseline later, then this token may never become trending again.

So we need some kind of mathematical model that can:

- accomodate multiple tokens
- establish the baseline of each token
- update the baselines
- identify trends
- identify the length of trends and untrending events

A mere % (% of times this token appears in a sample set of say 1000 Immis) or such cannot be used here, because some tokens may be trending only in some time. So a % will not work correctly here. For example: "Mahendra Singh Dhoni" token will see high number of occurence during IPL matches in the Indian evenings but "Stephen Curry" or "Golden State Warriors" may be seeing more number of occurence during NBA matches in the American timezone (one among the many they have).

The mathematical model needs to accomodate this variation.

There can be other tunables/weights based on how many times each unique user is generating a token. So, for example, an user running a for loop posting "$POLITICALLEADER is the best and I am a fanboy" should not create a fake "$POLITICALLEADER" as a trend. This is happening in twitter for example, where IT Cells of political parties trend fake hashtags making their political masters appear more popular than their opposition. So the mathematical model may need to identify/restrict with some kind of account-id-scoring too. The account-id-scoring would also come in handy to not consider tokens generated by bots into the Trending calculation.

Trend identification can be a complex topic. As complex as google's search result ranking or ad identification etc. What I am trying to do here, is basically scratch the surface and find a minimal "trending topic identification" algorithm (or its mathematical model) that merely works based on the tokens identified from the incoming Immis. I am not even considering the account-id-scoring for now, and would rather gatekeep the account creation, which is simpler.

However, I do not have enough math knowledge to find a numerical method, that would look at the per-minute tokens and establish/update the baseline, identify [un]trends, etc. Any references or suggestions for how we can achieve it ?
