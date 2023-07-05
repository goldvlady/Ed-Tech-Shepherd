import React, {
  createContext,
  useState,
  useContext,
  Dispatch,
  SetStateAction
} from 'react';

interface IMnemonic {
  prompt: string;
  answer: string;
  explanation: string;
}

interface IMnemonicSetupContextProps {
  mnemonics: IMnemonic[];
  setMnemonics: Dispatch<SetStateAction<IMnemonic[]>>;
  addMnemonic: (mnemonic: IMnemonic) => void;
  updateMnemonic: (index: number, updatedMnemonic: IMnemonic) => void;
  deleteMnemonic: (index: number) => void;
  generateMneomics: () => void;
}

const MnemonicSetupContext = createContext<
  IMnemonicSetupContextProps | undefined
>(undefined);

export const useMnemonicSetupState = () => {
  const context = useContext(MnemonicSetupContext);
  if (!context) {
    throw new Error(
      'useMnemonicSetupState must be used within a MnemonicSetupProvider'
    );
  }
  return context;
};

const MnemonicSetupProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [mnemonics, setMnemonics] = useState<IMnemonic[]>([]);

  const addMnemonic = (mnemonic: IMnemonic) => {
    setMnemonics([...mnemonics, mnemonic]);
  };

  const generateMneomics = () => {
    setMnemonics((prev) => {
      const newData = prev.map((prev) => {
        prev.answer =
          'All ALphabetically ARranged, ASparagus As A Main Course, Could Get Grossly Gassy, Having Histamine Iced Lattes, Lousy Kebabs Might Perk you up, Phenomenal Fried Plantains, Perfectly Pressed, Simply Scrumptious Thistles, Tasty Tofu, Voila!';
        prev.explanation =
          'There are 20 amino acids commonly found in proteins: Alanine, Arginine, Asparagine, Aspartic acid, Cysteine, Glutamic acid, Glutamine, Glycine, Histidine, Isoleucine, Leucine, Lysine, Methionine, Phenylalanine, Proline, Serine, Threonine, Tryptophan, Tyrosine, Valine.';
        return prev;
      });
      return [...newData];
    });
  };

  const updateMnemonic = (index: number, updatedMnemonic: IMnemonic) => {
    setMnemonics(
      mnemonics.map((mnemonic, i) => (i === index ? updatedMnemonic : mnemonic))
    );
  };

  const deleteMnemonic = (index: number) => {
    setMnemonics(mnemonics.filter((_, i) => i !== index));
  };

  return (
    <MnemonicSetupContext.Provider
      value={{
        mnemonics,
        setMnemonics,
        addMnemonic,
        updateMnemonic,
        deleteMnemonic,
        generateMneomics
      }}
    >
      {children}
    </MnemonicSetupContext.Provider>
  );
};

export default MnemonicSetupProvider;
