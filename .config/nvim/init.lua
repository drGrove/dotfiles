-- [[ init.lua ]]

-- LEADER
vim.g.mapleader = " "
vim.g.localleader = "\\"

-- IMPORTS
require('vars')      -- Variables
require('plug')      -- Plugins
require('opts')      -- Options
require('keys')      -- Keymaps

vim.api.nvim_create_autocmd({ "BufWritePre" }, {
  pattern = { "*" },
  command = [[%s/\s\+$//e]],
})

vim.diagnostic.config({
  virtual_text = true,
  signs = true,
  update_in_insert = false,
  underline = true,
  severity_sort = false,
  float = true,
})

local bufopts = { noremap = true, silent = true, buffer = bufnr }

vim.keymap.set("n", "<space>e", vim.diagnostic.open_float, bufopts)
