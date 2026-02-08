// ==UserScript==
// @name         La Cale Traductions RP
// @namespace    https://github.com/Unidarks/lacale-traductionrp
// @version      1.5
// @license      GNU GPLv3
// @description  Ajoute une bulle de sur les termes du roleplay de la piraterie, traduits en termes classique du warez. Pour les nouveaux membres non initiés.
// @author       Unidark
// @match        *://*.la-cale.space/*
// @grant        GM_addStyle
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // =============================================================================
    // 1. CONFIGURATION & DICTIONNAIRE
    // =============================================================================

    const DICTIONARY = [
        {
            pattern: /\b((la|les|des) )?cargaisons? jetée?s? à la mer\b/gi,
            translation: "Torrent retiré"
        },
        {
            pattern: /\bjetée?s? à la mer\b/gi,
            translation: "Torrent retiré"
        },
        {
            pattern: /\bjeter à la mer\b/gi,
            translation: "Supprimer, effacer, retirer"
        },
        {
            pattern: /\b((la|les|des) )?cargaisons?\b/gi,
            translation: "Torrent"
        },
        {
            pattern: /\b((le|les) )?butins?\b/gi,
            translation: "Torrent complété"
        },
        {
            pattern: /\bDocuments? de Bord\b/gi,
            translation: "Fiche info"
        },
        {
            pattern: /\bsilver ?leech\b/gi,
            translation: "Téléchargement comptant de moitié dans le ratio"
        },
        {
            pattern: /\bdoublons?\b/gi,
            translation: "Crédits/Monnaie virtuelle"
        },
        {
            pattern: /\b(pillage)s?\b/gi,
            translation: "Leech/téléchargement"
        },
        {
            pattern: /\blettres? de marque\b/gi,
            translation: "Invitation"
        },
        {
            pattern: /\bcode d('|’)honneur\b/gi,
            translation: "Ratio up/down"
        },
        {
            pattern: /\bs(é|e)same du capitaine?\b/gi,
            translation: "Clé API"
        },
        {
            pattern: /\b(d(é|e)sertions?|H ?\& ?R|Hit ?\& ?Run)\b/gi,
            translation: "Hit & Run : Téléchargement/leech sans laisser en partage/seed."
        },
        {
            pattern: /\bdpillages? gratuits?\b/gi,
            translation: "Freeleech"
        },
        {
            pattern: /\b(l('|’))?(é|e)quipages?\b/gi,
            translation: "La communauté (peer, seeder, leecher)"
        },
        {
            pattern: /\ble registre( (API|\(API\)))?\b/gi,
            translation: "Documentation API"
        },
        {
            pattern: /\bquai principal\b/gi,
            translation: "Catégorie du torrent"
        },
        {
            pattern: /\bjournal de bord\b/gi,
            translation: "Actualité du site, annonces et notifications"
        },
        {
            pattern: /\bla planche\b/gi,
            translation: "Sanction"
        },
        {
            pattern: /\bcorbeaux?( voyageurs?)?\b/gi,
            translation: "Message privé"
        },
        {
            pattern: /\btoutes voiles dehors\b/gi,
            translation: "Torrents rapides"
        },
        {
            pattern: /\blégendes des mers\b/gi,
            translation: "Torrent les plus populaires"
        },
        {
            pattern: /\bvaisseaux? fant(o|ô)mes?\b/gi,
            translation: "Torrent sans seed"
        },
        {
            pattern: /\bprimes?\b/gi,
            translation: "Torrent recherché contre crédits"
        },
        {
            pattern: /\bnouve(l|aux?) arrivages?\b/gi,
            translation: "Torrent récemment ajouté"
        },
        /* ESPACES */
        {
            pattern: /\b((la )?taverne|(l('|’))?infirmerie)s?\b/gi,
            translation: "Chat/shoutbox"
        },
        {
            pattern: /\b(le )?mess\b/gi,
            translation: "Forum"
        },
        {
            pattern: /\b(la )?cour des miracles\b/gi,
            translation: "Discipline/Hit&Run"
        },
        {
            pattern: /\b(les )?registres de la flotte\b/gi,
            translation: "Statistiques"
        },
        {
            pattern: /\b(le )?marché noir\b/gi,
            translation: "Boutique"
        },
        {
            pattern: /\b(la )?boussole\b/gi,
            translation: "Moteur de recherche"
        },
        {
            pattern: /\bpigeonnier\b/gi,
            translation: "Messagerie"
        },
        {
            pattern: /\bpillés?\b/gi,
            translation: "Téléchargé/leech"
        },
        {
            pattern: /\bhauts? faits??\b/gi,
            translation: "Trophée"
        },
        {
            pattern: /\bchangelogs?\b/gi,
            translation: "Journal de modifications et mises à jour"
        },
        /* ROLES */
        {
            pattern: /\bpirates?\b/gi,
            translation: "Membre de la communauté"
        },
        {
            pattern: /\bmousses?\b/gi,
            translation: "Novice / Pas ou peu d'upload de nouveau torrents"
        },
        {
            pattern: /\b(taverniers?|officiers? de bord)\b/gi,
            translation: "Modérateur"
        },
        {
            pattern: /\bfrères? d('|’)arme\b/gi,
            translation: "Membre d'honneur"
        },
        {
            pattern: /\bmatelots?\b/gi,
            translation: "Si rôle : Membre uploader assez actif. Sinon : Membre"
        },
        {
            pattern: /\bmatelots? d('|’)or\b/gi,
            translation: "Membre distingué par le staff"
        },
        {
            pattern: /\bartilleu(r|euse)s?\b/gi,
            translation: "TEAM ou membre actif qui envoi des torrents de son cru"
        },
        {
            pattern: /(?<!\p{L})flibusti(er|(è|e)re)s?(?!\p{L})/gui,
            translation: "Membre de l'équipe Team Pending (TP) qui traite les soumissions de nouveaux torrents (uploads)"
        },
        {
            pattern: /\bma(î|i)tres?( |-)d('|’)(é|e)quipages?\b/gi,
            translation: "Super modérateur"
        },
        {
            pattern: /\bquartier( |-)ma(î|i)tres?\b/gi,
            translation: "Administrateur"
        },
        {
            pattern: /\bcapitaines?\b/gi,
            translation: "Si rôle : Super administrateur"
        },
        {
            pattern: /(l('|’))?(é|e|É)tat( |-)major/gi,
            translation: "Staff"
        },
        /* DISTINCTIONS DE VOLUME PARTAGE */
        {
            pattern: /\bRadeau\b/gi,
            translation: "Distinction : A partagé moins de 5 Go (seed)"
        },
        {
            pattern: /\bBarque\b/gi,
            translation: "Distinction : A partagé 5 Go (seed)"
        },
        {
            pattern: /\bGo(é|e)lette\b/gi,
            translation: "Distinction : A partagé 25 Go (seed)"
        },
        {
            pattern: /\bFr(é|e)gate\b/gi,
            translation: "Distinction : A partagé 100 Go (seed)"
        },
        {
            pattern: /\bGalion\b/gi,
            translation: "Distinction : A partagé 500 Go (seed)"
        },
        {
            pattern: /\bVaisseau de ligne\b/gi,
            translation: "Distinction : A partagé 1 To (seed)"
        },
    ];



    // =============================================================================
    // 2. STYLES CSS (GLOBAL TOOLTIP)
    // =============================================================================

    const INFO_ICON_CLASS = 'rp-info-icon';
    const GLOBAL_TOOLTIP_ID = 'rp-global-tooltip';
    const WRAPPER_CLASS = 'rp-translation-wrapper';
    const PROCESSED_CLASS = 'rp-translation-processed';
    const WORD_CLASS = 'rp-translated-word';
    const ACCENT_COLOR = '#2563EB';

    GM_addStyle(`
        .${PROCESSED_CLASS} { display: inline; }

        .${WRAPPER_CLASS} {
            display: inline;
            white-space: nowrap;
        }

        /* Soulignement */
        .${WORD_CLASS} {
            text-decoration: underline dotted;
            text-decoration-thickness: 1px;
            text-underline-offset: 2px;
        }

        /* Icône */
        .${INFO_ICON_CLASS} {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin-left: 3px;
            width: 14px;
            height: 14px;
            border-radius: 50%;
            background-color: ${ACCENT_COLOR};
            color: #FFFFFF;
            font-size: 10px;
            font-family: sans-serif;
            font-weight: bold;
            font-style: normal;
            vertical-align: middle;
            user-select: none;
            box-shadow: 0 1px 2px rgba(0,0,0,0.1);
            transform: translateY(-1px);
        }

        /* --- TOOLTIP GLOBAL (Attaché au body) --- */
        #${GLOBAL_TOOLTIP_ID} {
            position: absolute; /* Sort du flux normal des divs */
            z-index: 2147483647; /* Maximum théorique */
            visibility: hidden;
            opacity: 0;
            width: max-content;
            max-width: 250px;
            background-color: var(--popover);
            color: var(--popover-foreground);
            border: 1px solid var(--muted);
            text-align: center;
            border-radius: 6px;
            padding: 6px 12px;
            font-size: 11px;
            font-weight: normal;
            font-family: sans-serif;
            line-height: 1.4;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
            pointer-events: none; /* Permet de cliquer à travers si besoin */
            transform: translateX(-50%); /* Centrage horizontal */
            transition: opacity 0.1s ease-in-out;
            top: 0;
            left: 0;
        }

        #${GLOBAL_TOOLTIP_ID}.visible {
            visibility: visible;
            opacity: 1;
        }

        /* Flèche du tooltip */
        #${GLOBAL_TOOLTIP_ID}::after {
            content: "";
            position: absolute;
            left: 50%;
            margin-left: -4px;
            border-width: 4px;
            border-style: solid;
        }

        /* Mode Normal (Flèche en bas, tooltip au dessus) */
        #${GLOBAL_TOOLTIP_ID}:not(.bottom-mode)::after {
            top: 100%;
            border-color: #1F2937 transparent transparent transparent;
        }

        /* Mode Inversé (Flèche en haut, tooltip en dessous) */
        #${GLOBAL_TOOLTIP_ID}.bottom-mode::after {
            bottom: 100%;
            border-color: transparent transparent #1F2937 transparent;
        }
    `);

    // =============================================================================
    // 3. LOGIQUE DE TRAITEMENT
    // =============================================================================

    const IGNORED_TAGS = new Set(['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'CODE', 'PRE', 'NOSCRIPT', 'IMG', 'SVG', 'SELECT', 'OPTION', 'BUTTON']);

    function processTextNodes(rootNode) {
        if (!rootNode.isConnected) return;

        // Fusion des nœuds texte (Fix "Mot"+"s")
        rootNode.normalize();

        const walker = document.createTreeWalker(
            rootNode,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function(node) {
                    if (IGNORED_TAGS.has(node.parentNode.tagName)) return NodeFilter.FILTER_REJECT;
                    if (node.parentNode.closest(`.${PROCESSED_CLASS}`)) return NodeFilter.FILTER_REJECT;
                    if (!node.textContent || node.textContent.trim().length === 0) return NodeFilter.FILTER_SKIP;
                    return NodeFilter.FILTER_ACCEPT;
                }
            },
            false
        );

        const nodesToReplace = [];
        while (walker.nextNode()) {
            if (DICTIONARY.some(entry => entry.pattern.test(walker.currentNode.textContent))) {
                nodesToReplace.push(walker.currentNode);
            }
        }
        nodesToReplace.forEach(replaceTextNode);
    }

    function replaceTextNode(textNode) {
        let originalText = textNode.textContent;
        if (!textNode.parentNode) return;

        const sortedDictionary = [...DICTIONARY].sort((a, b) => b.pattern.source.length - a.pattern.source.length);

        let tempText = originalText;
        let placeholders = [];
        let modified = false;

        sortedDictionary.forEach(entry => {
            entry.pattern.lastIndex = 0;
            if (entry.pattern.test(tempText)) {
                tempText = tempText.replace(entry.pattern, (match) => {
                    placeholders.push({ match: match, translation: entry.translation });
                    modified = true;
                    return `___RP_TOKEN_${placeholders.length - 1}___`;
                });
            }
        });

        if (modified) {
            let finalHtml = escapeHTML(tempText);

            finalHtml = finalHtml.replace(/___RP_TOKEN_(\d+)___/g, (fullMatch, index) => {
                const p = placeholders[index];
                const safeMatch = escapeHTML(p.match);
                const content = `<span class="${WORD_CLASS}">${safeMatch}</span><span class="${INFO_ICON_CLASS}">i</span>`;
                return `<span class="${WRAPPER_CLASS}" data-rp-translation="${escapeHTML(p.translation)}">${content}</span>`;
            });

            const container = document.createElement('span');
            container.className = PROCESSED_CLASS;
            container.innerHTML = finalHtml;
            textNode.parentNode.replaceChild(container, textNode);
        }
    }

    // --- Titles & Utils ---
    function processTitles(rootNode) {
        const elements = rootNode.querySelectorAll ? rootNode.querySelectorAll('[title]') : [];
        if (rootNode.getAttribute && rootNode.getAttribute('title')) modifyTitleAttribute(rootNode);
        elements.forEach(modifyTitleAttribute);
    }

    function modifyTitleAttribute(element) {
        let title = element.getAttribute('title');
        if (!title || title.trim() === "") return;
        const sortedDictionary = [...DICTIONARY].sort((a, b) => b.pattern.source.length - a.pattern.source.length);
        let modified = false;

        sortedDictionary.forEach(entry => {
            entry.pattern.lastIndex = 0;
            if (entry.pattern.test(title) && !title.includes(`(${entry.translation})`)) {
                title = title.replace(entry.pattern, `$& (${entry.translation})`);
                modified = true;
            }
        });
        if (modified) element.setAttribute('title', title);
    }

    function escapeHTML(str) {
        return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }

    // =============================================================================
    // 4. GESTIONNAIRE D'ÉVÉNEMENTS (TOOLTIP GLOBAL & POSITIONNEMENT)
    // =============================================================================

    // Création unique du tooltip global
    let globalTooltip = document.createElement('div');
    globalTooltip.id = GLOBAL_TOOLTIP_ID;
    document.body.appendChild(globalTooltip);

    function updateTooltipPosition(wrapper) {
        const rect = wrapper.getBoundingClientRect();

        // Coordonnées absolues (incluant le scroll actuel)
        const scrollX = window.scrollX || window.pageXOffset;
        const scrollY = window.scrollY || window.pageYOffset;

        // Position par défaut : Au-dessus
        let top = rect.top + scrollY - globalTooltip.offsetHeight - 8;
        let left = rect.left + scrollX + (rect.width / 2);

        // Smart Position : Si on est trop près du haut de l'écran (< 80px)
        if (rect.top < 80) {
            // On passe en dessous
            top = rect.bottom + scrollY + 8;
            globalTooltip.classList.add('bottom-mode');
        } else {
            globalTooltip.classList.remove('bottom-mode');
        }

        globalTooltip.style.top = `${top}px`;
        globalTooltip.style.left = `${left}px`;
    }

    // Listener unifié (Délégation d'événement pour la performance)
    document.body.addEventListener('mouseover', function(e) {
        const wrapper = e.target.closest(`.${WRAPPER_CLASS}`);
        if (!wrapper) return;

        // 1. Récupérer le texte
        const text = wrapper.dataset.rpTranslation;
        if (!text) return;

        // 2. Mettre à jour le contenu
        globalTooltip.textContent = text; // textContent est safe (pas d'injection HTML)

        // 3. Calculer la position (après avoir mis le texte pour avoir la bonne taille)
        updateTooltipPosition(wrapper);

        // 4. Afficher
        globalTooltip.classList.add('visible');
    }, { passive: true });

    document.body.addEventListener('mouseout', function(e) {
        const wrapper = e.target.closest(`.${WRAPPER_CLASS}`);
        if (wrapper) {
            globalTooltip.classList.remove('visible');
        }
    }, { passive: true });

    // --- Init & Observer ---
    let timeoutId = null;
    function debouncedProcess(node) {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            processTextNodes(node || document.body);
            processTitles(node || document.body);
            timeoutId = null;
        }, 100);
    }

    debouncedProcess(document.body);

    const observer = new MutationObserver((mutations) => {
        let shouldProcess = false;
        for (const mutation of mutations) {
            if (mutation.target.closest && mutation.target.closest(`.${PROCESSED_CLASS}`)) continue;
            if (mutation.type === 'attributes' && mutation.attributeName === 'title') { shouldProcess = true; break; }
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                 const isOurNode = Array.from(mutation.addedNodes).some(node =>
                     node.nodeType === 1 && (node.classList.contains(PROCESSED_CLASS) || node.querySelector(`.${PROCESSED_CLASS}`))
                 );
                 if (!isOurNode) { shouldProcess = true; break; }
            }
        }
        if (shouldProcess) debouncedProcess(document.body);
    });
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['title'] });

})();
