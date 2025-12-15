import * as utils from './utils.js';

export function addDragEvents(appDescriptionImmediateChildrenSelector) {
    $('body')
        .on('dragover', appDescriptionImmediateChildrenSelector, function(event) {
            event.preventDefault(); // Cancel dragover so that drop can fire

            const draggedElementToBeDropped = $('div#app-description').data('draggedElement');
            const nextElements = $(this).prevAll();

            console.log('prevAll: ' , $(this).prevAll());
            console.log('nextAll: ' , $(this).nextAll());
            $(this).prevAll().css('top', '');
            const b = $(this).next();
            const bTop = b.position().top;
            const finalTop = parseInt(draggedElementToBeDropped.attr('data-dragstart-top'));

            console.log('FINAL TOP', finalTop);
            $(draggedElementToBeDropped).css('margin-top', '-' + (bTop - finalTop) + 'px');

            $(this).nextAll().addBack().filter((index, element) => element !== draggedElementToBeDropped).css('top', Math.round($(draggedElementToBeDropped).outerHeight(true)) + 'px');

        }).on('dragenter', appDescriptionImmediateChildrenSelector, function() {
            if (this != $('div#app-description').data('draggedElement').get()) { // Should not include itself
                $(this).css('outline', '5px solid magenta');
                $('div#app-description').data('hoveredWhileDraggingElement', this);
            }
        }).on('dragleave', appDescriptionImmediateChildrenSelector, function() {
            $(this).css('outline', '');
            $('div#app-description').data('hoveredWhileDraggingElement', undefined);

        }).on('dragstart', appDescriptionImmediateChildrenSelector, function() {
            const draggedElement = $(this);
            $('div#app-description').data('draggedElement', draggedElement.attr('data-dragstart-top', draggedElement.position().top));
            console.log('DRAGSTART', this);

        }).on('drop', appDescriptionImmediateChildrenSelector, function(event) {
            event.preventDefault(); // Prevent the browser default handling of the data (default is open as link on drop)
            const draggedElementToBeDropped = $('div#app-description').data('draggedElement');
            const hoveredElementToReceiveNewSibling = $('div#app-description').data('hoveredWhileDraggingElement');

            console.log('DROPPING ELEMENT...', draggedElementToBeDropped);

            $('div#app-description').data('draggedElement', undefined);
            // draggedElementToBeDropped.attr('data-dragstart-drop', '');
        });

        $('button#fetch-github-user-repos').on('click', function() {
            const githubUsername = $('input#github-user').val();
            const githubUsernamePlaceholder = $('input#github-user').attr('placeholder');
            const finalUsername = githubUsername ? githubUsername : githubUsernamePlaceholder;

            if (!finalUsername) {
                alert('No GitHub username set!');
            } else {
                $('button#inspect-github-user-project').prop('disabled', true);
                const githubReposSelectList = $('#github-user-repos').html('');

                // TODO: add error handler
                utils.fetchData(`/github-repos?username=${encodeURIComponent(githubUsername ? githubUsername : githubUsernamePlaceholder)}`, 'json').then((json, error) => {
                    console.log(json);
                    json.map(repo => {
                        const serializedRepositoryData = JSON.stringify({full_name: repo.full_name, default_branch: repo.default_branch});
                        const escapedRepositoryData = utils.escapeHtmlAttr(serializedRepositoryData);
                        return `<option value="${escapedRepositoryData}" data-html-url="${repo.html_url}" data-default-branch="${repo.default_branch}">${repo.name}</option>`;
                    }).forEach(option => githubReposSelectList.append(option));

                    $('button#inspect-github-user-project').prop('disabled', false);
                });
            }
        });

        $('button#inspect-github-user-project').on('click', function() {
            const repositoryData = JSON.parse($('select#github-user-repos').val() || '{}');

            if (repositoryData) {
                utils.fetchData(`/github-repo-inspect?repositoryFullName=${repositoryData.full_name}&defaultBranchName=${encodeURIComponent(repositoryData.default_branch)}`);
            }
        });
}
