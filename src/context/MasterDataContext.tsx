import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Specialty } from '../types/master';

interface MasterDataContextType {
  specialties: Specialty[];
  addSpecialty: (specialty: Omit<Specialty, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateSpecialty: (id: string, specialty: Partial<Specialty>) => void;
  deleteSpecialty: (id: string) => void;
  getActiveSpecialties: () => Specialty[];
}

const MasterDataContext = createContext<MasterDataContextType | undefined>(undefined);

// Initial specialties data
const initialSpecialties: Specialty[] = [
  {
    id: '1',
    code: 'INF',
    name: 'Informática',
    familyId: '1',
    description: 'Especialidad de Informática',
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    code: 'ELE',
    name: 'Electrónica',
    familyId: '2',
    description: 'Especialidad de Electrónica',
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    code: 'MEC',
    name: 'Mecánica',
    familyId: '3',
    description: 'Especialidad de Mecánica',
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const MasterDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [specialties, setSpecialties] = useState<Specialty[]>([]);

  useEffect(() => {
    const storedSpecialties = localStorage.getItem('specialties');
    if (storedSpecialties) {
      setSpecialties(JSON.parse(storedSpecialties));
    } else {
      setSpecialties(initialSpecialties);
      localStorage.setItem('specialties', JSON.stringify(initialSpecialties));
    }
  }, []);

  const addSpecialty = (specialty: Omit<Specialty, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newSpecialty: Specialty = {
      ...specialty,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now
    };
    const updatedSpecialties = [...specialties, newSpecialty];
    setSpecialties(updatedSpecialties);
    localStorage.setItem('specialties', JSON.stringify(updatedSpecialties));
  };

  const updateSpecialty = (id: string, updates: Partial<Specialty>) => {
    const updatedSpecialties = specialties.map(specialty =>
      specialty.id === id
        ? { ...specialty, ...updates, updatedAt: new Date().toISOString() }
        : specialty
    );
    setSpecialties(updatedSpecialties);
    localStorage.setItem('specialties', JSON.stringify(updatedSpecialties));
  };

  const deleteSpecialty = (id: string) => {
    const updatedSpecialties = specialties.filter(specialty => specialty.id !== id);
    setSpecialties(updatedSpecialties);
    localStorage.setItem('specialties', JSON.stringify(updatedSpecialties));
  };

  const getActiveSpecialties = () => {
    return specialties.filter(specialty => specialty.active);
  };

  return (
    <MasterDataContext.Provider value={{
      specialties,
      addSpecialty,
      updateSpecialty,
      deleteSpecialty,
      getActiveSpecialties
    }}>
      {children}
    </MasterDataContext.Provider>
  );
};

export const useMasterData = () => {
  const context = useContext(MasterDataContext);
  if (context === undefined) {
    throw new Error('useMasterData must be used within a MasterDataProvider');
  }
  return context;
};