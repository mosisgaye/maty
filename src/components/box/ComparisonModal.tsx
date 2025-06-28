// components/box/
import React from 'react';
import { Box } from '@/types/box';
import { Button } from '@/components/ui/button';
import { X, Zap, Wifi, Shield, Euro, CheckCircle, XCircle } from 'lucide-react';

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  comparisonList: string[];
  boxes: Box[];
  onRemoveFromComparison: (id: string) => void;
}

const ComparisonModal: React.FC<ComparisonModalProps> = ({
  isOpen,
  onClose,
  comparisonList,
  boxes,
  onRemoveFromComparison
}) => {
  if (!isOpen) return null;

  const comparedBoxes = boxes.filter(box => comparisonList.includes(box.id.toString()));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Comparaison des box ({comparedBoxes.length})
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-auto max-h-[calc(90vh-120px)]">
          {comparedBoxes.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400">
                Aucune box sélectionnée pour la comparaison
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left p-3 font-medium text-gray-900 dark:text-gray-100">
                      Caractéristiques
                    </th>
                    {comparedBoxes.map((box) => (
                      <th key={box.id} className="text-center p-3 min-w-[200px]">
                        <div className="space-y-2">
                          <div className="font-semibold text-gray-900 dark:text-gray-100">
                            {box.nom}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onRemoveFromComparison(box.id.toString())}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {/* Prix */}
                  <tr>
                    <td className="p-3 font-medium text-gray-900 dark:text-gray-100">
                      Prix mensuel
                    </td>
                    {comparedBoxes.map((box) => (
                      <td key={box.id} className="p-3 text-center">
                        <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                          {box.prix_mensuel.toFixed(2).replace('.', ',')}€
                        </div>
                        {box.duree_promo > 0 && (
                          <div className="text-xs text-gray-500">
                            puis {box.prix_apres_promo.toFixed(2).replace('.', ',')}€
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Débit */}
                  <tr>
                    <td className="p-3 font-medium text-gray-900 dark:text-gray-100">
                      <Zap className="inline w-4 h-4 mr-2" />
                      Débit
                    </td>
                    {comparedBoxes.map((box) => (
                      <td key={box.id} className="p-3 text-center">
                        <div className="font-medium">
                          {box.debit_down >= 1000 ? 
                            `${box.debit_down / 1000} Gb/s` : 
                            `${box.debit_down} Mb/s`
                          }
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Technologie */}
                  <tr>
                    <td className="p-3 font-medium text-gray-900 dark:text-gray-100">
                      Technologie
                    </td>
                    {comparedBoxes.map((box) => (
                      <td key={box.id} className="p-3 text-center">
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                          {box.technologie}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Wi-Fi */}
                  <tr>
                    <td className="p-3 font-medium text-gray-900 dark:text-gray-100">
                      <Wifi className="inline w-4 h-4 mr-2" />
                      Wi-Fi
                    </td>
                    {comparedBoxes.map((box) => (
                      <td key={box.id} className="p-3 text-center">
                        {box.wifi}
                      </td>
                    ))}
                  </tr>

                  {/* Engagement */}
                  <tr>
                    <td className="p-3 font-medium text-gray-900 dark:text-gray-100">
                      <Shield className="inline w-4 h-4 mr-2" />
                      Engagement
                    </td>
                    {comparedBoxes.map((box) => (
                      <td key={box.id} className="p-3 text-center">
                        {box.engagement === 0 ? 'Sans engagement' : `${box.engagement} mois`}
                      </td>
                    ))}
                  </tr>

                  {/* TV */}
                  <tr>
                    <td className="p-3 font-medium text-gray-900 dark:text-gray-100">
                      TV incluse
                    </td>
                    {comparedBoxes.map((box) => (
                      <td key={box.id} className="p-3 text-center">
                        {box.tv_incluse ? (
                          <CheckCircle className="inline w-5 h-5 text-green-500" />
                        ) : (
                          <XCircle className="inline w-5 h-5 text-gray-300" />
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Téléphone */}
                  <tr>
                    <td className="p-3 font-medium text-gray-900 dark:text-gray-100">
                      Téléphone fixe
                    </td>
                    {comparedBoxes.map((box) => (
                      <td key={box.id} className="p-3 text-center">
                        {box.telephone_fixe ? (
                          <CheckCircle className="inline w-5 h-5 text-green-500" />
                        ) : (
                          <XCircle className="inline w-5 h-5 text-gray-300" />
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Installation */}
                  <tr>
                    <td className="p-3 font-medium text-gray-900 dark:text-gray-100">
                      <Euro className="inline w-4 h-4 mr-2" />
                      Installation
                    </td>
                    {comparedBoxes.map((box) => (
                      <td key={box.id} className="p-3 text-center">
                        {box.installation}
                      </td>
                    ))}
                  </tr>

                  {/* Actions */}
                  <tr>
                    <td className="p-3 font-medium text-gray-900 dark:text-gray-100">
                      Action
                    </td>
                    {comparedBoxes.map((box) => (
                      <td key={box.id} className="p-3 text-center">
                        <Button
                          onClick={() => window.open(box.url_tracking, '_blank')}
                          className="w-full"
                        >
                          Souscrire
                        </Button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComparisonModal;