-- Create necessary extensions
create extension if not exists "uuid-ossp";

-- Create communities table
create table if not exists communities (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  owner_id uuid references auth.users(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create games table
create table if not exists games (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  community_id uuid references communities(id) not null,
  status text not null default 'active' check (status in ('active', 'finished')),
  score integer[] not null default '{0,0}' check (array_length(score, 1) = 2),
  team1 uuid[] not null default '{}',
  team2 uuid[] not null default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create competitions table
create table if not exists competitions (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  game_id uuid references games(id) not null,
  start_date timestamp with time zone not null,
  end_date timestamp with time zone not null,
  status text not null default 'pending' check (status in ('pending', 'active', 'finished')),
  players uuid[] not null default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  check (end_date > start_date)
);

-- Create players table
create table if not exists players (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) not null,
  nickname text not null,
  avatar_url text,
  community_id uuid references communities(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, community_id)
);

-- Create matches table
create table if not exists matches (
  id uuid default uuid_generate_v4() primary key,
  game_id uuid references games(id) not null,
  winner smallint check (winner in (1, 2, null)),
  points integer not null default 1,
  type text not null check (type in ('simple', 'carroca', 'la-e-lo', 'cruzada', 'contagem')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create row level security policies
alter table communities enable row level security;
alter table games enable row level security;
alter table competitions enable row level security;
alter table players enable row level security;
alter table matches enable row level security;

-- Communities policies
create policy "Communities are viewable by everyone"
  on communities for select
  using (true);

create policy "Communities can be created by authenticated users"
  on communities for insert
  with check (auth.uid() = owner_id);

create policy "Communities can be updated by owners"
  on communities for update
  using (auth.uid() = owner_id);

create policy "Communities can be deleted by owners"
  on communities for delete
  using (auth.uid() = owner_id);

-- Games policies
create policy "Games are viewable by everyone"
  on games for select
  using (true);

create policy "Games can be created by community owners"
  on games for insert
  with check (
    auth.uid() in (
      select owner_id from communities
      where id = community_id
    )
  );

create policy "Games can be updated by community owners"
  on games for update
  using (
    auth.uid() in (
      select owner_id from communities
      where id = community_id
    )
  );

create policy "Games can be deleted by community owners"
  on games for delete
  using (
    auth.uid() in (
      select owner_id from communities
      where id = community_id
    )
  );

-- Competitions policies
create policy "Competitions are viewable by everyone"
  on competitions for select
  using (true);

create policy "Competitions can be created by community owners"
  on competitions for insert
  with check (
    auth.uid() in (
      select c.owner_id from communities c
      join games g on g.community_id = c.id
      where g.id = game_id
    )
  );

create policy "Competitions can be updated by community owners"
  on competitions for update
  using (
    auth.uid() in (
      select c.owner_id from communities c
      join games g on g.community_id = c.id
      where g.id = game_id
    )
  );

create policy "Competitions can be deleted by community owners"
  on competitions for delete
  using (
    auth.uid() in (
      select c.owner_id from communities c
      join games g on g.community_id = c.id
      where g.id = game_id
    )
  );

-- Players policies
create policy "Players are viewable by everyone"
  on players for select
  using (true);

create policy "Players can be created by authenticated users"
  on players for insert
  with check (auth.uid() = user_id);

create policy "Players can be updated by themselves"
  on players for update
  using (auth.uid() = user_id);

create policy "Players can be deleted by themselves or community owners"
  on players for delete
  using (
    auth.uid() = user_id or
    auth.uid() in (
      select owner_id from communities
      where id = community_id
    )
  );

-- Matches policies
create policy "Matches are viewable by everyone"
  on matches for select
  using (true);

create policy "Matches can be created by community owners"
  on matches for insert
  with check (
    auth.uid() in (
      select c.owner_id from communities c
      join games g on g.community_id = c.id
      where g.id = game_id
    )
  );

create policy "Matches can be updated by community owners"
  on matches for update
  using (
    auth.uid() in (
      select c.owner_id from communities c
      join games g on g.community_id = c.id
      where g.id = game_id
    )
  );

create policy "Matches can be deleted by community owners"
  on matches for delete
  using (
    auth.uid() in (
      select c.owner_id from communities c
      join games g on g.community_id = c.id
      where g.id = game_id
    )
  );