<div align="center">

<img width="100px" src="https://github.com/homanp/superagent/assets/2464556/eb51fa38-4a2a-4c41-b348-d3c1abc04234" />

# Superagent

### The Open Source AI Assistant Framework & API

<p>
<img alt="GitHub Contributors" src="https://img.shields.io/github/contributors/homanp/Superagent" />
<img alt="GitHub Last Commit" src="https://img.shields.io/github/last-commit/homanp/Superagent" />
<img alt="" src="https://img.shields.io/github/repo-size/homanp/Superagent" />
<img alt="GitHub Issues" src="https://img.shields.io/github/issues/homanp/Superagent" />
<img alt="GitHub Pull Requests" src="https://img.shields.io/github/issues-pr/homanp/Superagent" />
<img alt="GitHub License" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
<img alt="Discord" src="https://img.shields.io/discord/1110910277110743103?label=Discord&logo=discord&logoColor=white&style=plastic&color=d7b023)](https://discord.gg/e8j7mgjDUK" />
</p>

-----

<p align="center">
  <a href="#-demo">Demo</a> •
  <a href="#-use-cases">Use cases</a> •
  <a href="#-features">Features</a> •
  <a href="https://docs.superagent.sh" target="_blank">Docs</a> •
  <a href="https://discord.com/invite/mhmJUTjW4b" target="_blank">Discord</a> •
  <a href="#-tutorials" target="_blank">Tutorials</a> •
  <a href="#-sdks" target="_blank">SDKs</a> •
  <a href="#-contributions" target="_blank">Contributions</a>
</p>

-----

Superagent allows any developer to add powerful AI assistants to their applications. These assistants use large language models (LLM), retrieval augmented generation (RAG), and generative AI to help users.

Fully open-source. Backed by Y Combinator. Part of YC W24.

-----

## 🎥 Demo

https://github.com/homanp/superagent/assets/2464556/1a742181-6a5f-428c-82db-5f891dad0d31


## ✨ Use cases

Superagent lets you build any AI application/microservice you want, including:

- Question/Answering over Documents (LLM Finetunes/Vectorstores).
- Chatbots.
- Co-pilots & AI assistants.
- Content generation.
- Data aggregation.
- Workflow automation agent.


## 👀 Features:

- Memory
- Streaming
- Python and Typescript SDKs
- REST API
- API connectivity
- Vectorization
- Support for third-party vector stores (e.g Weaviate, Pinecone)
- Support for proprietary and open-source LLMs
- API concurrency support

## 🛠️ Run locally:

Clone the Superagent repository into a public GitHub repository or Fork it from [https://github.com/homanp/superagent/fork](https://github.com/homanp/superagent/fork). 

If you plan to distribute the code, keep the source code public.

Both the API and UI require a database in order to work. We recommend setting this up on Supabase. 

<details>
<summary>Setting up Supabase</summary>

Create a [Supabase](https://supabase.com) account and project. 
We have separated the UI and API into two separate Supabase projects, which is recommended since the app runs on `prisma`.

**Supabase setup for Superagent UI project:**

1. Run the migrations (checkout Superagent UI section for this)
    ```sh
    supabase migration up (locally)
    supabase db push (cloud)
    ```
2. Run the following query to setup authentication:
    ```sh
    -- inserts a row into public.profiles
    create function public.handle_new_user()
    returns trigger
    language plpgsql
    security definer set search_path = public
    as $$
    begin
    insert into public.profiles (user_id)
    values (new.id);
    return new;
    end;
    $$;

    -- trigger the function every time a user is created,
    create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();
    ```

3. Create a Supabase storage

4. Set storage permissions:
   Set the following policy for `storage.objects`
   <img width="2672" alt="Screenshot 2023-09-14 at 23 27 35" src="https://github.com/homanp/superagent/assets/2464556/8d6bde18-528e-4e0a-9840-aabe39ce5e68">

    
</details>

<details>
<summary>Setting up Github OAuth in UI</summary>

1. Create a new Github OAuth app in your [Github account](https://github.com/settings/developers)

2. Copy the `CLIENT_ID` and `CLIENT_SECRET` and paste them into the `.env` variables in the Superagent UI project.

3. Set the following callback URL
    ```sh
    <YOUR_SUPABASE_URL>/auth/v1/callback
    ```
4. Navigate to your Supabase project you have created for Superagent UI and paste the `CLIENT_ID` and `CLIENT_SECRET`

<img width="2672" alt="Screenshot 2023-09-15 at 09 08 52" src="https://github.com/homanp/superagent/assets/2464556/abd1e2fb-df90-413a-b674-766343683f6c">

**NOTE**: You can enable any provider using the steps above.
    
</details>

<details>
<summary>Superagent API</summary>

1. Navigate to `/libs/superagent`

2. Rename the `env.example` to `.env`  and make sure you have all mandatory values set

3. Create a virtual environment

    ```sh
    virtualenv venv
    source venv/bin/activate
    ```

4. Install dependencies

    ```sh
    poetry install
    ```

5. Run database migrations

    ```sh
    poetry run prisma migrate dev
    ```

6. Start the server

    ```sh
    uvicorn app.main:app --reload
    ```
</details>

<details>
<summary>Superagent UI</summary>

1. Navigate to `/libs/ui`

2. Rename the `env.example` to `.env`  and make sure you have all mandatory values set

3. Install the dependencies:

    ```sh
    npm install
    ```
4. Run migrations:
    ```sh
    supabase migrate up (local)
    supabase db push (cloud)
    ```

4. Run the development server

    ```sh
    npm run dev

    ```

</details>

## 📋 Documentation:
For full documentation, examples and setup guidelines, visit [docs.superagent.sh](https://docs.superagent.sh)


## 🔗 SDKs

If you are planning to integrate Superagent into your stack, you can use one of the following SDKs:

- [Python](https://github.com/homanp/superagent-py)
- [Typescript/Javascript](https://github.com/homanp/superagent-js)
- [Swift](https://github.com/simonweniger/superagent-swift) (Community)


## 🫶 Contributions:

Superagent is an open-source project, and contributions are welcome. If you want to contribute, you can create new features, fix bugs, or improve the infrastructure. Please refer to the [CONTRIBUTING.md](https://github.com/homanp/Superagent/blob/main/.github/CONTRIBUTING.md) file in the repository for more information on how to contribute.

To see how to contribute, visit [Contribution guidelines](https://github.com/homanp/Superagent/blob/main/.github/CONTRIBUTING.md)

To help with contributions, you can search, navigate, and understand Superagent's source code using Onboard AI's free tool LearnThisRepo.
[learnthisrepo.com/superagent](https://learnthisrepo.com/superagent)


