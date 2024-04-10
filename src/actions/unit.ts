'use server';

import { db } from "@/lib/db";
import { languages } from '@/lib/countries'

export const getUnits = async (sectionId: string) => {
  const units = await db.unit.findMany({
    where: {
      sectionId: sectionId
    }
  })

  return units
}

export const getUnitsById = async (unitId: string) => {
  const units = await db.unit.findMany({
    where: {
      id: unitId
    }
  })

  return units
}

export const updateUnit = async (unitId: string, unitName: string, unitDescription: string) => {

  if (!unitId) {
    throw new Error('Unit ID is required')
  }

  if (!unitName) {
    throw new Error('Unit name is required')
  }

  const updatedUnit = await db.unit.update({
    where: {
      id: unitId
    },
    data: {
      title: unitName,
      description: unitDescription
    }
  })

  return updatedUnit
}

export const deleteUnit = async (unitId: string) => {
  const deletedUnit = await db.unit.delete({
    where: {
      id: unitId
    }
  })

  return deletedUnit
}

export const createUnit = async (unitName: string, unitDescription: string, sectionId: string) => {
  const newUnit = await db.unit.create({
    data: {
      title: unitName,
      description: unitDescription,
      sectionId: sectionId
    }
  })

  return newUnit
}