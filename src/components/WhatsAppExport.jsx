import React, { useState } from 'react';
import { MessageSquare, Copy, Check, Share2 } from 'lucide-react';
import { formatDate } from '../utils/scheduleCalculator';

const WhatsAppExport = ({ schedule, selectedDate }) => {
  const [copied, setCopied] = useState(false);

  const generateWhatsAppMessage = () => {
    const dateStr = formatDate(selectedDate);
    let message = `📋 *ESCALA DO DIA*\n`;
    message += `📅 ${dateStr}\n`;
    message += `${'═'.repeat(35)}\n\n`;

    schedule.forEach(section => {
      if (section.position !== 'Folga' && section.employees.length > 0) {
        message += `🚨 *${section.position.toUpperCase()}*\n`;
        
        section.employees.forEach(employee => {
          if (employee.isCovering) {
            message += `├ 🔄 ${employee.name} _(Cobertura)_\n`;
            if (employee.coveringFor) {
              message += `│  └ Cobrindo: ${employee.coveringFor}\n`;
            }
          } else {
            message += `├ ${employee.name}`;
            if (!employee.isSubstitute) {
              message += ` (${employee.shiftType})`;
            }
            message += `\n`;
          }
        });
        
        message += `\n`;
      }
    });

    // Add off-duty section
    const offDutySection = schedule.find(s => s.position === 'Folga');
    if (offDutySection && offDutySection.employees.length > 0) {
      message += `${'─'.repeat(35)}\n`;
      message += `💤 *FUNCIONÁRIOS DE FOLGA*\n`;
      offDutySection.employees.forEach(employee => {
        message += `├ ${employee.name}`;
        if (employee.shiftType) {
          message += ` (${employee.shiftType})`;
        }
        message += `\n`;
      });
    }

    message += `\n${'═'.repeat(35)}\n`;
    message += `✅ _Escala gerada automaticamente_\n`;
    message += `📱 _Sistema Escalas 2.0_`;

    return message;
  };

  const handleCopy = () => {
    const message = generateWhatsAppMessage();
    navigator.clipboard.writeText(message).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleShareWhatsApp = () => {
    const message = generateWhatsAppMessage();
    const encodedMessage = encodeURIComponent(message);
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile) {
      window.location.href = `whatsapp://send?text=${encodedMessage}`;
    } else {
      window.open(`https://web.whatsapp.com/send?text=${encodedMessage}`, '_blank');
    }
  };

  const message = generateWhatsAppMessage();

  return (
    <div className="animate-fadeIn">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-slate-900">Exportar para WhatsApp</h2>
        <p className="text-slate-600 mt-1">
          Compartilhe a escala formatada no WhatsApp
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Preview */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <MessageSquare className="text-emerald-500" size={24} />
            Pré-visualização
          </h3>
          
          <div className="bg-slate-50 rounded-lg p-4 border-2 border-slate-200 font-mono text-sm whitespace-pre-wrap break-words max-h-[600px] overflow-y-auto">
            {message}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-6">
            <h3 className="text-xl font-bold text-emerald-900 mb-4">
              Compartilhar Escala
            </h3>
            
            <div className="space-y-3">
              <button
                onClick={handleShareWhatsApp}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
              >
                <Share2 size={24} />
                Abrir no WhatsApp
              </button>

              <button
                onClick={handleCopy}
                className={`w-full font-bold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-3 shadow-md ${
                  copied
                    ? 'bg-green-500 text-white'
                    : 'bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-300'
                }`}
              >
                {copied ? (
                  <>
                    <Check size={24} />
                    Copiado!
                  </>
                ) : (
                  <>
                    <Copy size={24} />
                    Copiar Mensagem
                  </>
                )}
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-emerald-200">
              <h4 className="font-bold text-emerald-900 mb-2">
                📱 Como usar:
              </h4>
              <ol className="text-sm text-emerald-800 space-y-2 list-decimal list-inside">
                <li>Clique em "Abrir no WhatsApp" para compartilhar diretamente</li>
                <li>Ou copie a mensagem e cole em qualquer conversa</li>
                <li>A formatação será preservada no WhatsApp</li>
              </ol>
            </div>
          </div>

          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
            <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
              💡 Dicas
            </h4>
            <ul className="text-sm text-blue-800 space-y-2">
              <li>• Use emojis para identificação rápida no campo</li>
              <li>• 🚨 indica plantão ativo</li>
              <li>• 🔄 indica cobertura de folguista</li>
              <li>• 💤 mostra funcionários de folga</li>
              <li>• A mensagem é formatada automaticamente</li>
            </ul>
          </div>

          {schedule.length === 0 && (
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
              <h4 className="font-bold text-yellow-900 mb-2">
                ⚠️ Aviso
              </h4>
              <p className="text-sm text-yellow-800">
                Adicione funcionários e gere uma escala antes de exportar para o WhatsApp.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Character Count */}
      <div className="mt-6 bg-slate-100 rounded-lg p-4 text-center">
        <p className="text-sm text-slate-600">
          Total de caracteres: <span className="font-bold text-slate-900">{message.length}</span>
        </p>
      </div>
    </div>
  );
};

export default WhatsAppExport;
