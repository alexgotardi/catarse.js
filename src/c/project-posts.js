import m from 'mithril';
import postgrest from 'mithril-postgrest';
import _ from 'underscore';
import models from '../models';
import h from '../h';

const projectPosts = {
    controller(args) {
        const listVM = postgrest.paginationVM(models.projectPostDetail),
            filterVM = postgrest.filtersVM({
                project_id: 'eq',
                id: 'eq'
            });

        filterVM.project_id(args.project().id);

        if (_.isNumber(args.post_id)) {
            filterVM.id(args.post_id);
        }

        if (!listVM.collection().length) {
            listVM.firstPage(filterVM.parameters());
        }

        return {
            listVM: listVM,
            filterVM: filterVM
        };
    },
    view(ctrl, args) {
        const list = ctrl.listVM,
            project = args.project() || {};

        return m('.project-posts.w-section', [
            m('.w-container.u-margintop-20', [
                (project.is_owner_or_admin ? [
                    (!list.isLoading()) ?
                    (_.isEmpty(list.collection()) ? m('.w-hidden-small.w-hidden-tiny', [
                        m('.fontsize-base.u-marginbottom-30.u-margintop-20', 'Toda novidade publicada no Catarse é enviada diretamente para o email de quem já apoiou seu projeto e também fica disponível para visualização no site. Você pode optar por deixá-la pública, ou visível somente para seus apoiadores aqui nesta aba.')
                    ]) : '') : '',
                    m('.w-row.u-marginbottom-20', [
                        m('.w-col.w-col-4'),
                        m('.w-col.w-col-4', [
                            m(`a.btn.btn-edit.btn-small[href='/pt/projects/${project.id}/edit#posts']`, 'Escrever novidade')
                        ]),
                        m('.w-col.w-col-4'),
                    ])
                ] : ''), (_.map(list.collection(), (post) => {
                    return m('.w-row', [
                        m('.w-col.w-col-1'),
                        m('.w-col.w-col-10', [
                            m('.post', [
                                m('.u-marginbottom-60 .w-clearfix', [
                                    m('.fontsize-small.fontcolor-secondary.u-text-center', h.momentify(post.created_at)),
                                    m('p.fontweight-semibold.fontsize-larger.u-text-center.u-marginbottom-30', [
                                        m(`a.link-hidden[href="/projects/${post.project_id}/posts/${post.id}#posts"]`, post.title)
                                    ]),
                                    (!_.isEmpty(post.comment_html) ? m('.fontsize-base', m.trust(post.comment_html)) : m('.fontsize-base', 'Post exclusivo para apoiadores.'))
                                ]),
                                m('.divider.u-marginbottom-60')
                            ])
                        ]),
                        m('.w-col.w-col-1')
                    ]);
                })),
                m('.w-row', [
                    m('.w-col.w-col-2.w-col-push-5', [
                        (!_.isUndefined(args.post_id) ? '' :
                         (!list.isLoading() ?
                          (list.isLastPage() ? 'Nenhuma novidade.' : m('button#load-more.btn.btn-medium.btn-terciary', {
                              onclick: list.nextPage
                          }, 'Carregar mais')) :
                          h.loader())),
                    ])
                ])
            ]),
        ]);
    }
};

export default projectPosts;
