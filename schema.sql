SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

-- 1. Create Tables
CREATE TABLE public.ingredients (
    id integer NOT NULL,
    name character varying(255) NOT NULL
);

CREATE TABLE public.recipes (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    cooking_time_minutes integer,
    servings integer,
    image_url text,
    rating numeric(2,1),
    source_url text,
    notes text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.tags (
    id integer NOT NULL,
    name character varying(50) NOT NULL
);

CREATE TABLE public.instructions (
    id integer NOT NULL,
    recipe_id integer,
    step_number integer,
    instruction_text text
);

CREATE TABLE public.recipe_ingredients (
    id integer NOT NULL,
    recipe_id integer,
    ingredient_id integer,
    amount numeric(10,2),
    unit character varying(50)
);

CREATE TABLE public.recipe_tags (
    recipe_id integer NOT NULL,
    tag_id integer NOT NULL
);

CREATE TABLE public.roster (
    id integer NOT NULL,
    recipe_id integer,
    added_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

-- 2. Sequences
CREATE SEQUENCE public.ingredients_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.ingredients_id_seq OWNED BY public.ingredients.id;

CREATE SEQUENCE public.recipes_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.recipes_id_seq OWNED BY public.recipes.id;

CREATE SEQUENCE public.tags_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.tags_id_seq OWNED BY public.tags.id;

CREATE SEQUENCE public.instructions_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.instructions_id_seq OWNED BY public.instructions.id;

CREATE SEQUENCE public.recipe_ingredients_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.recipe_ingredients_id_seq OWNED BY public.recipe_ingredients.id;

CREATE SEQUENCE public.roster_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.roster_id_seq OWNED BY public.roster.id;

-- 3. Set Default Values for IDs
ALTER TABLE ONLY public.ingredients ALTER COLUMN id SET DEFAULT nextval('public.ingredients_id_seq'::regclass);
ALTER TABLE ONLY public.recipes ALTER COLUMN id SET DEFAULT nextval('public.recipes_id_seq'::regclass);
ALTER TABLE ONLY public.tags ALTER COLUMN id SET DEFAULT nextval('public.tags_id_seq'::regclass);
ALTER TABLE ONLY public.instructions ALTER COLUMN id SET DEFAULT nextval('public.instructions_id_seq'::regclass);
ALTER TABLE ONLY public.recipe_ingredients ALTER COLUMN id SET DEFAULT nextval('public.recipe_ingredients_id_seq'::regclass);
ALTER TABLE ONLY public.roster ALTER COLUMN id SET DEFAULT nextval('public.roster_id_seq'::regclass);

-- 4. Primary Keys
ALTER TABLE ONLY public.ingredients ADD CONSTRAINT ingredients_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.recipes ADD CONSTRAINT recipes_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.tags ADD CONSTRAINT tags_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.instructions ADD CONSTRAINT instructions_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.recipe_ingredients ADD CONSTRAINT recipe_ingredients_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.recipe_tags ADD CONSTRAINT recipe_tags_pkey PRIMARY KEY (recipe_id, tag_id);
ALTER TABLE ONLY public.roster ADD CONSTRAINT roster_pkey PRIMARY KEY (id);

-- 5. Foreign Keys
ALTER TABLE ONLY public.instructions
    ADD CONSTRAINT instructions_recipe_id_fkey FOREIGN KEY (recipe_id) REFERENCES public.recipes(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.recipe_ingredients
    ADD CONSTRAINT recipe_ingredients_ingredient_id_fkey FOREIGN KEY (ingredient_id) REFERENCES public.ingredients(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.recipe_ingredients
    ADD CONSTRAINT recipe_ingredients_recipe_id_fkey FOREIGN KEY (recipe_id) REFERENCES public.recipes(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.recipe_tags
    ADD CONSTRAINT recipe_tags_recipe_id_fkey FOREIGN KEY (recipe_id) REFERENCES public.recipes(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.recipe_tags
    ADD CONSTRAINT recipe_tags_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES public.tags(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.roster
    ADD CONSTRAINT roster_recipe_id_fkey FOREIGN KEY (recipe_id) REFERENCES public.recipes(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.ingredients ADD CONSTRAINT ingredients_name_unique UNIQUE (name);
ALTER TABLE ONLY public.tags ADD CONSTRAINT tags_name_unique UNIQUE (name);