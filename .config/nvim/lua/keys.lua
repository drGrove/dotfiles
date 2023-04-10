--[[ keys.lua ]]
require('mapx').setup{ global = "force" }
-- movement
nmap('<Left>', '<<')
nmap('<Right>', '>>')
nmap('<Up>', '[e')
nmap('<Down>', ']e')
vmap('<Left>', '<gv')
vmap('<Right>', '>gv')
vmap('<Up>', '[egv')
vmap('<Down>', ']egv')

-- remap the key used to leave insert mode
inoremap('jk', '<ESC>')

noremap('<MiddleMouse>', '<LeftMouse>')

-- Toggle nvim-tree
nmap('<F2>', [[:NvimTreeToggle<CR>]])

-- Tagbar
nnoremap('<F9>', '[[:TagbarToggle<CR>]]', { silent = true })

-- Telescope
-- nnoremap('ff', '[[:Telescope find_files]]')

-- Split Navigation
nnoremap('<C-J>', '<C-W>j')
nnoremap('<C-K>', '<C-W>k')
nnoremap('<C-H>', '<C-W>h')
nnoremap('<C-L>', '<C-W>l')

-- Tab Navigation
nnoremap('<Leader>j', 'gT')
nnoremap('<Leader>k', 'gt')
