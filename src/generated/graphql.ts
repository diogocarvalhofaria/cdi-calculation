import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export interface Scalars {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
}

export interface CreateUserInput {
  /** The email of the user */
  email: Scalars['String']['input'];
  /** The name of the user */
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
}

export interface DefaultMessage {
  message: Scalars['String']['output'];
  status: Scalars['Int']['output'];
}

export interface Mutation {
  createUser: DefaultMessage;
  removeUser: DefaultMessage;
  updateUser: DefaultMessage;
}


export interface MutationCreateUserArgs {
  createUserInput: CreateUserInput;
}


export interface MutationRemoveUserArgs {
  id: Scalars['String']['input'];
}


export interface MutationUpdateUserArgs {
  updateUserInput: UpdateUserInput;
}

export interface Query {
  findOne: User;
}


export interface QueryFindOneArgs {
  userId: Scalars['String']['input'];
}

export interface UpdateUserInput {
  /** The email of the user */
  email?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  /** The name of the user */
  name?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
}

export interface User {
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
}

export type DefaultMessageFragment = { status: number, message: string };

export type CreateUserMutationVariables = Exact<{
  createUserInput: CreateUserInput;
}>;


export type CreateUserMutation = { createUser: { status: number, message: string } };

export const DefaultMessageFragmentDoc = gql`
    fragment DefaultMessage on DefaultMessage {
  status
  message
}
    `;
export const CreateUserDocument = gql`
    mutation CreateUser($createUserInput: CreateUserInput!) {
  createUser(createUserInput: $createUserInput) {
    ...DefaultMessage
  }
}
    ${DefaultMessageFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateUserGQL extends Apollo.Mutation<CreateUserMutation, CreateUserMutationVariables> {
    document = CreateUserDocument;
    override client = 'default';
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
