/* @flow */
export type JSONSchema$Type$Base = {
  id?: string,
  required?: boolean
}

export type JSONSchema$Type$Object = JSONSchema$Type$Base & {
  type: 'object',
  properties: {[key: string]: JSONSchema$Type},
  additionalProperties?: false,
  minProperties?: number,
  maxProperties?: number
}

export type JSONSchema$Type$Array = JSONSchema$Type$Base & {
  type: 'array',
  items: JSONSchema$Type,
  maxItems?: number,
  uniqueItems?: boolean,
  additionalItems?: JSONSchema$Type | boolean
}

export type JSONSchema$Type$Number = JSONSchema$Type$Base & {
  type: 'number' | 'integer',
  minimum?: number,
  miximum?: number,
  exclusiveMinimum?: boolean
}

export type JSONSchema$Type$String = JSONSchema$Type$Base & {
  type: 'string',
  pattern?: string
}

export type JSONSchema$Type$Boolean = JSONSchema$Type$Base & {
  type: 'boolean'
}

export type JSONSchema$Type$Null = JSONSchema$Type$Base & {
  type: 'null'
}

export type JSONSchema$Type$Ref = {
  $ref: string
}

export type JSONSchema$Type$Enum = {
  enum: string[] | JSONSchema$Type$Ref
}

export type JSONSchema$Type =
  JSONSchema$Type$Object |
  JSONSchema$Type$Array |
  JSONSchema$Type$Number |
  JSONSchema$Type$String |
  JSONSchema$Type$Boolean |
  JSONSchema$Type$Null |
  JSONSchema$Type$Ref |
  JSONSchema$Type$Enum

export type JSONSchema$Value = JSONSchema$Type

export type JSONSchema = JSONSchema$Type
