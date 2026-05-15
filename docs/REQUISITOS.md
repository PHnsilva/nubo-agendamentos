# Requisitos — Nubo

## Visão
O Nubo conecta clientes a prestadores locais com busca filtrada, perfil público, curadoria por moderador e agenda.

## Perfis
- `CLIENTE`: busca prestadores, visualiza perfis e solicita agendamentos.
- `PRESTADOR`: usuário aprovado por moderação, com acesso ao painel de serviços e agenda.
- `MODERADOR`: analisa candidaturas, aprova, rejeita e solicita ajustes.

Cliente que envia candidatura continua sendo `CLIENTE` até a aprovação. O sistema não usa `ADMIN` nem `PRESTADOR_CANDIDATO`.

## Regras Principais
- Prestador só aparece publicamente se tiver candidatura aprovada, perfil ativo, ao menos um serviço e região de atendimento.
- Um cliente não pode ter mais de uma candidatura ativa simultânea.
- Rejeição e solicitação de ajuste exigem justificativa.
- Não pode existir mais de um agendamento confirmado no mesmo horário para o mesmo prestador.
- Prestador pendente não acessa o dashboard de prestador.
- Cliente sem login pode buscar e visualizar perfis, mas não pode solicitar agendamento.

## Dados De Teste
| Perfil | E-mail | Senha |
|---|---|---|
| MODERADOR | `moderador@nubo.local` | `Moderador@123` |
| CLIENTE | `cliente@nubo.local` | `Cliente@123` |
| PRESTADOR aprovado | `prestador@nubo.local` | `Prestador@123` |
| CLIENTE com candidatura pendente | `pendente@nubo.local` | `Pendente@123` |

O seed também cria prestadores adicionais em beleza, manutenção, bem-estar, tecnologia, consultoria e eventos.
